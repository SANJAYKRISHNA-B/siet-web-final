<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
date_default_timezone_set('Asia/Kolkata');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function getClientIp(): string
{
    $remote = (string)($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
    $trustedProxies = ['127.0.0.1', '::1'];
    $envProxies = getenv('TRUSTED_PROXIES');
    if ($envProxies) {
        $trustedProxies = array_merge($trustedProxies, array_map('trim', explode(',', $envProxies)));
    }
    if (in_array($remote, $trustedProxies, true)) {
        if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
            $cfIp = trim((string)$_SERVER['HTTP_CF_CONNECTING_IP']);
            if (filter_var($cfIp, FILTER_VALIDATE_IP)) return $cfIp;
        }
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ips = explode(',', (string)$_SERVER['HTTP_X_FORWARDED_FOR']);
            $first = trim($ips[0]);
            if (filter_var($first, FILTER_VALIDATE_IP)) return $first;
        }
    }
    return filter_var($remote, FILTER_VALIDATE_IP) ? $remote : '127.0.0.1';
}

function enforceRateLimit(string $endpointKey, int $maxAttempts = 3, int $decaySeconds = 900): void
{
    $ip = getClientIp();
    $cacheDir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'siet_rate_limits';
    if (!is_dir($cacheDir)) {
        @mkdir($cacheDir, 0700, true);
    }
    $hashKey = hash('sha256', $endpointKey . '|' . $ip);
    $filePath = $cacheDir . DIRECTORY_SEPARATOR . 'rl_' . $hashKey . '.json';
    $now = time();
    $data = ['count' => 0, 'reset' => $now + $decaySeconds];
    if (is_file($filePath)) {
        $raw = @file_get_contents($filePath);
        $decoded = $raw ? json_decode($raw, true) : null;
        if (is_array($decoded) && isset($decoded['reset']) && $decoded['reset'] > $now) {
            $data = $decoded;
        }
    }
    $data['count'] = (int)($data['count'] ?? 0) + 1;
    if (!isset($data['reset']) || $data['reset'] <= $now) {
        $data['reset'] = $now + $decaySeconds;
    }
    @file_put_contents($filePath, json_encode($data), LOCK_EX);
    if ($data['count'] > $maxAttempts) {
        $retryAfter = max(1, $data['reset'] - $now);
        header('Retry-After: ' . $retryAfter);
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Too many requests. You have exceeded the resume submission limit. Please try again in ' . $retryAfter . ' seconds.'
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['success' => false, 'message' => 'POST method required.']);
}

// Enforce per-IP rate limiting: maximum 3 career resume submissions per 15 minutes (SIET-SEC-006 Remediation)
enforceRateLimit('career_submit', 3, 900);
if (!empty($_SERVER['HTTP_ORIGIN'])) {
    $originHost = parse_url((string)$_SERVER['HTTP_ORIGIN'], PHP_URL_HOST);
    $originPort = parse_url((string)$_SERVER['HTTP_ORIGIN'], PHP_URL_PORT);
    $requestHost = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
    if (!is_string($originHost) || strtolower($originHost . ($originPort ? ':' . $originPort : '')) !== $requestHost) {
        respond(403, ['success' => false, 'message' => 'Cross-origin form submissions are not allowed.']);
    }
}

/*
 * cPanel production connection order:
 * 1. Reuse the existing SIET connection at public_html/webportal/masterdb_config.php.
 * 2. Load career-config.php for webhook settings and as the database fallback.
 * This lets the handler reuse the legacy database connection while still reading
 * the mail webhook settings from its protected configuration file.
 */
$config = [];
$db = null;
$publicHtmlDirectory = dirname(__DIR__);
$configPath = getenv('CAREER_CONFIG_PATH') ?: __DIR__ . '/career-config.php';
if (is_file($configPath)) {
    $loadedConfig = require $configPath;
    if (is_array($loadedConfig)) $config = $loadedConfig;
}

$legacyConfigPath = $publicHtmlDirectory . '/webportal/masterdb_config.php';
if (is_file($legacyConfigPath)) {
    require_once $legacyConfigPath;
    if (isset($masterdb_con) && $masterdb_con instanceof mysqli) {
        $db = $masterdb_con;
    }
}

if (!$db) {
    if (!is_file($configPath)) {
        error_log('Career API database configuration was not found.');
        respond(500, ['success' => false, 'message' => 'Career service database is not configured.']);
    }
    foreach (['db_host', 'db_name', 'db_user', 'db_pass'] as $key) {
        if (!isset($config[$key]) || $config[$key] === '') {
            respond(500, ['success' => false, 'message' => 'Career service configuration is incomplete.']);
        }
    }
}

function value(string $newName, string $legacyName = ''): string
{
    $raw = $_POST[$newName] ?? ($legacyName !== '' ? ($_POST[$legacyName] ?? '') : '');
    return trim(is_string($raw) ? $raw : '');
}

function textLength(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

function hasControlCharacters(string $value, bool $allowNewlines = false): bool
{
    $pattern = $allowNewlines ? '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/' : '/[\x00-\x1F\x7F]/';
    return preg_match($pattern, $value) === 1;
}

function institutionCode(string $institution): string
{
    $normalized = strtolower(trim($institution));
    if (str_contains($normalized, 'food') || str_contains($normalized, 'lab')) return 'FTL';
    if (str_contains($normalized, 'school')) return 'SCH';
    return 'ENG';
}

function notifyCareerMailer(array $application, array $config): bool
{
    $url = getenv('CAREER_MAIL_WEBHOOK_URL') ?: ($config['mail_webhook_url'] ?? '');
    $token = getenv('CAREER_MAIL_WEBHOOK_TOKEN') ?: ($config['mail_webhook_token'] ?? '');
    if ($url === '' || $token === '') {
        error_log('Career mail webhook skipped: configure mail_webhook_url and mail_webhook_token in career-config.php or PHP environment variables.');
        return false;
    }
    if (!function_exists('curl_init')) {
        error_log('Career mail webhook skipped: PHP cURL extension is unavailable.');
        return false;
    }

    $curl = curl_init((string)$url);
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'X-Career-Mail-Token: ' . $token,
        ],
        CURLOPT_POSTFIELDS => json_encode($application, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
    ]);
    curl_exec($curl);
    $status = (int)curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $error = curl_error($curl);
    curl_close($curl);
    if ($status < 200 || $status >= 300) {
        error_log('Career mail webhook failed. HTTP ' . $status . ($error ? ': ' . $error : ''));
        return false;
    }
    return true;
}

$data = [
    'fullname' => value('name', 'fullname'),
    'dept' => value('department', 'dept'),
    'position' => value('position'),
    'high_qualification' => value('qualification', 'high_qualification'),
    'social_cat' => value('socialCategory', 'social_cat'),
    'current_institution' => value('currentInstitution', 'current_institution'),
    'current_position' => value('currentPosition', 'current_position'),
    'city' => value('city'),
    'state' => value('state'),
    'country' => value('country'),
    'mobile' => value('phone', 'mobile'),
    'email' => strtolower(value('email')),
    'dob' => value('dateOfBirth', 'dob'),
    'teaching' => value('teachingExperience', 'teaching') ?: '0',
    'industry' => value('industrialExperience', 'industry') ?: '0',
    'research' => value('researchExperience', 'research') ?: '0',
    'current_salary_range' => value('currentSalary', 'current_salary_range'),
    'expected_salary_range' => value('expectedSalary', 'expected_salary_range'),
    'notice_period' => value('noticePeriod', 'notice_period'),
    'why_change' => value('message', 'why_change'),
    'source' => value('openingSource', 'source'),
    'institute' => value('institution', 'institute'),
    'category' => value('category'),
];

$required = ['fullname', 'dept', 'position', 'high_qualification', 'social_cat', 'country', 'state', 'city', 'mobile', 'email', 'dob', 'expected_salary_range', 'institute', 'category'];
$missing = [];
foreach ($required as $field) {
    if ($data[$field] === '') $missing[] = $field;
}
if ($missing) respond(422, ['success' => false, 'message' => 'Please complete all required fields.', 'fields' => $missing]);
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) respond(422, ['success' => false, 'message' => 'Enter a valid email address.']);
if (!preg_match('/^[0-9]{10}$/D', $data['mobile'])) respond(422, ['success' => false, 'message' => 'Enter a 10-digit contact number using numbers only.']);
if (!preg_match('/^[\p{L}\p{M} .\x27-]{2,100}$/u', $data['fullname'])) respond(422, ['success' => false, 'message' => 'Enter a valid full name using letters only.']);
if (textLength($data['why_change']) > 2000 || hasControlCharacters($data['why_change'], true)) respond(422, ['success' => false, 'message' => 'The reason for changing position must be 2,000 characters or fewer.']);
foreach (['dept', 'position', 'high_qualification', 'social_cat', 'country', 'state', 'city', 'current_institution', 'current_position', 'current_salary_range', 'expected_salary_range', 'notice_period', 'source', 'institute'] as $field) {
    if (textLength($data[$field]) > 200 || hasControlCharacters($data[$field])) respond(422, ['success' => false, 'message' => 'One or more fields are too long or contain invalid control characters.']);
}

$date = DateTimeImmutable::createFromFormat('Y-m-d', $data['dob']);
if (!$date) $date = DateTimeImmutable::createFromFormat('d/m/Y', $data['dob']);
if (!$date) respond(422, ['success' => false, 'message' => 'Enter a valid date of birth.']);
$data['dob'] = $date->format('Y-m-d');
$today = new DateTimeImmutable('today');
$age = $date->diff($today)->y;
if ($age < 18) {
    respond(422, ['success' => false, 'message' => 'Applicant must be at least 18 years of age to apply.']);
}

if (!isset($_FILES['resume']) || $_FILES['resume']['error'] !== UPLOAD_ERR_OK) {
    respond(422, ['success' => false, 'message' => 'Please upload your resume.']);
}

$resume = $_FILES['resume'];
$maxBytes = min(2097152, max(1, (int)($config['max_upload_bytes'] ?? 2097152)));
if ((int)$resume['size'] > $maxBytes) respond(413, ['success' => false, 'message' => 'Resume must not exceed 2 MB.']);
if ((int)$resume['size'] < 100) respond(422, ['success' => false, 'message' => 'Resume file is empty or corrupted (minimum 100 bytes required).']);

$resumeName = (string)$resume['name'];
$cleanResumeName = basename($resumeName);
if (preg_match('/[\0<>:"\/\\|?*]/', $cleanResumeName)) {
    respond(422, ['success' => false, 'message' => 'Resume filename contains invalid or dangerous characters.']);
}

// Block any executable, script or dangerous extensions anywhere in the filename (prevents double-extension exploits e.g. resume.pdf.exe)
$forbiddenPattern = '/(?:^|\.)(?:exe|bat|cmd|sh|php|phtml|phar|vbs|js|jar|scr|pif|msi|dll|com|hta|ps1|apk|bin|cgi|pl|py|wsf|cpl|gadget|iso|dmg|vhd)(?:\.|$)/i';
if (preg_match($forbiddenPattern, $cleanResumeName)) {
    respond(422, ['success' => false, 'message' => 'Security Violation: Executable files (.exe, .bat, scripts) and malware are strictly prohibited.']);
}

$extension = strtolower(pathinfo($cleanResumeName, PATHINFO_EXTENSION));
$allowedExtensions = ['pdf', 'doc', 'docx', 'rtf'];
if (!in_array($extension, $allowedExtensions, true)) {
    respond(422, ['success' => false, 'message' => 'Resume must be PDF, DOC, DOCX, or RTF document.']);
}

// Deep Binary Magic Byte & Anti-Malware Inspection
$fh = fopen((string)$resume['tmp_name'], 'rb');
if (!$fh) respond(500, ['success' => false, 'message' => 'Unable to scan uploaded resume for security validation.']);
$magicBytes = fread($fh, 1024);
fclose($fh);

if (strlen($magicBytes) < 100) {
    respond(422, ['success' => false, 'message' => 'Resume file contains insufficient data (minimum 100 bytes required).']);
}

// 1. Block Windows / DOS PE Executable ('MZ' = 0x4D 0x5A)
if (substr($magicBytes, 0, 2) === "MZ") {
    respond(422, ['success' => false, 'message' => 'Security Violation: Windows executable (.exe) detected. Executable files and malware are strictly prohibited.']);
}

// 2. Block Linux ELF Executable (0x7F 'ELF')
if (substr($magicBytes, 0, 4) === "\x7FELF") {
    respond(422, ['success' => false, 'message' => 'Security Violation: ELF executable binary detected. Executable files and malware are strictly prohibited.']);
}

// 3. Block macOS Mach-O Executables
$machoSignatures = ["\xFE\xED\xFA\xCE", "\xFE\xED\xFA\xCF", "\xCE\xFA\xED\xFE", "\xCF\xFA\xED\xFE", "\xCA\xFE\xBA\xBE"];
if (in_array(substr($magicBytes, 0, 4), $machoSignatures, true)) {
    respond(422, ['success' => false, 'message' => 'Security Violation: Executable binary detected.']);
}

// 4. Block Script Headers (shebang, PHP, HTML script tags)
$headerLower = strtolower(substr($magicBytes, 0, 64));
if (str_starts_with($headerLower, '#!') || str_starts_with($headerLower, '<?php') || str_starts_with($headerLower, '<?') || str_contains($headerLower, '<script') || str_starts_with($headerLower, '@echo')) {
    respond(422, ['success' => false, 'message' => 'Security Violation: Script file detected. Scripts and malware are strictly prohibited.']);
}

// 5. Positive signature whitelist verification against declared extension
if ($extension === 'pdf') {
    if (!str_contains($magicBytes, '%PDF-')) {
        respond(422, ['success' => false, 'message' => 'Invalid document: The file does not have a genuine PDF signature (%PDF-).']);
    }
} elseif ($extension === 'docx') {
    if (substr($magicBytes, 0, 2) !== "PK") {
        respond(422, ['success' => false, 'message' => 'Invalid document: The file does not have a genuine Word (DOCX) package signature.']);
    }
} elseif ($extension === 'doc') {
    if (substr($magicBytes, 0, 4) !== "\xD0\xCF\x11\xE0") {
        respond(422, ['success' => false, 'message' => 'Invalid document: The file does not have a genuine Word (DOC) binary signature.']);
    }
} elseif ($extension === 'rtf') {
    if (!str_starts_with($headerLower, '{\\rtf')) {
        respond(422, ['success' => false, 'message' => 'Invalid document: The file does not have a genuine RTF signature.']);
    }
}

$uploadDir = rtrim((string)($config['upload_dir'] ?? $publicHtmlDirectory . '/webportal/resume'), '/\\');
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0750, true)) respond(500, ['success' => false, 'message' => 'Resume storage is unavailable.']);
$storedName = 'career-' . date('Ymd-His') . '-' . bin2hex(random_bytes(8)) . '.' . $extension;
$storedPath = $uploadDir . DIRECTORY_SEPARATOR . $storedName;
if (!move_uploaded_file((string)$resume['tmp_name'], $storedPath)) respond(500, ['success' => false, 'message' => 'Unable to store the resume.']);

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
try {
    if (!$db) {
        $db = new mysqli(
            (string)$config['db_host'],
            (string)$config['db_user'],
            (string)$config['db_pass'],
            (string)$config['db_name'],
            (int)($config['db_port'] ?? 3306)
        );
    }
    $db->set_charset('utf8mb4');
    $sql = 'INSERT INTO `applicant` (`fullname`,`dept`,`position`,`high_qualification`,`social_cat`,`current_institution`,`current_position`,`city`,`state`,`country`,`mobile`,`email`,`dob`,`teaching`,`industry`,`research`,`current_salary_range`,`expected_salary_range`,`notice_period`,`resume`,`why_change`,`source`,`institute`,`created_at`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())';
    $stmt = $db->prepare($sql);
    $stmt->bind_param(
        str_repeat('s', 23),
        $data['fullname'], $data['dept'], $data['position'], $data['high_qualification'], $data['social_cat'],
        $data['current_institution'], $data['current_position'], $data['city'], $data['state'], $data['country'],
        $data['mobile'], $data['email'], $data['dob'], $data['teaching'], $data['industry'], $data['research'],
        $data['current_salary_range'], $data['expected_salary_range'], $data['notice_period'], $storedName,
        $data['why_change'], $data['source'], $data['institute']
    );
    $stmt->execute();
    $id = $stmt->insert_id;
    $applicationNo = sprintf('SIET-%s-%s-%06d', institutionCode($data['institute']), date('Ymd'), (int)$id);
    $mailQueued = notifyCareerMailer([
        'applicationNo' => $applicationNo,
        'fullname' => $data['fullname'],
        'email' => $data['email'],
        'mobile' => $data['mobile'],
        'institute' => $data['institute'],
        'dept' => $data['dept'],
        'position' => $data['position'],
        'highQualification' => $data['high_qualification'],
        'city' => $data['city'],
        'state' => $data['state'],
        'country' => $data['country'],
        'teaching' => $data['teaching'],
        'industry' => $data['industry'],
        'research' => $data['research'],
        'expectedSalary' => $data['expected_salary_range'],
        'noticePeriod' => $data['notice_period'],
        'source' => $data['source'],
        'message' => $data['why_change'],
        'resume' => $storedName,
    ], $config);
    respond(201, [
        'success' => true,
        'message' => 'Your application has been submitted successfully.',
        'applicationNo' => $applicationNo,
        'id' => $id,
        'mailQueued' => $mailQueued,
    ]);
} catch (Throwable $error) {
    if (is_file($storedPath)) unlink($storedPath);
    error_log('Career application error: ' . $error->getMessage());
    respond(500, ['success' => false, 'message' => 'Unable to save your application. Please try again.']);
}
