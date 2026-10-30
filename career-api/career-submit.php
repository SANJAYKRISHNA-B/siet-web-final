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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['success' => false, 'message' => 'POST method required.']);
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
$publicHtmlDirectory = basename(dirname(__DIR__)) === 'new-site' ? dirname(__DIR__, 2) : dirname(__DIR__);
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
    'district' => value('district'),
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
];

$required = ['fullname', 'dept', 'position', 'high_qualification', 'social_cat', 'country', 'mobile', 'email', 'dob', 'expected_salary_range', 'institute'];
$missing = [];
foreach ($required as $field) {
    if ($data[$field] === '') $missing[] = $field;
}
if ($missing) respond(422, ['success' => false, 'message' => 'Please complete all required fields.', 'fields' => $missing]);
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) respond(422, ['success' => false, 'message' => 'Enter a valid email address.']);
if (!preg_match('/^\+?[0-9 ()-]{10,18}$/', $data['mobile'])) respond(422, ['success' => false, 'message' => 'Enter a valid contact number.']);

$date = DateTimeImmutable::createFromFormat('Y-m-d', $data['dob']);
if (!$date) $date = DateTimeImmutable::createFromFormat('d/m/Y', $data['dob']);
if (!$date) respond(422, ['success' => false, 'message' => 'Enter a valid date of birth.']);
$data['dob'] = $date->format('Y-m-d');

if (!isset($_FILES['resume']) || $_FILES['resume']['error'] !== UPLOAD_ERR_OK) {
    respond(422, ['success' => false, 'message' => 'Please upload your resume.']);
}

$resume = $_FILES['resume'];
$maxBytes = (int)($config['max_upload_bytes'] ?? 2097152);
if ((int)$resume['size'] > $maxBytes) respond(413, ['success' => false, 'message' => 'Resume must not exceed 2 MB.']);

$extension = strtolower(pathinfo((string)$resume['name'], PATHINFO_EXTENSION));
$allowedExtensions = ['pdf', 'doc', 'docx', 'rtf'];
$allowedMimes = [
    'pdf' => ['application/pdf'],
    'doc' => ['application/msword', 'application/octet-stream'],
    'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream'],
    'rtf' => ['application/rtf', 'text/rtf', 'text/plain', 'application/octet-stream'],
];
if (!in_array($extension, $allowedExtensions, true)) respond(422, ['success' => false, 'message' => 'Resume must be PDF, DOC, DOCX, or RTF.']);
$detectedMime = (new finfo(FILEINFO_MIME_TYPE))->file((string)$resume['tmp_name']) ?: 'application/octet-stream';
if (!in_array($detectedMime, $allowedMimes[$extension], true)) respond(422, ['success' => false, 'message' => 'The uploaded resume file type is invalid.']);

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
    $baseColumns = [
        'fullname', 'dept', 'position', 'high_qualification', 'social_cat', 'current_institution',
        'current_position', 'city', 'state', 'country', 'mobile', 'email', 'dob', 'teaching',
        'industry', 'research', 'current_salary_range', 'expected_salary_range', 'notice_period',
        'resume', 'why_change', 'source', 'institute',
    ];
    $baseValues = [
        $data['fullname'], $data['dept'], $data['position'], $data['high_qualification'], $data['social_cat'],
        $data['current_institution'], $data['current_position'], $data['city'], $data['state'], $data['country'],
        $data['mobile'], $data['email'], $data['dob'], $data['teaching'], $data['industry'], $data['research'],
        $data['current_salary_range'], $data['expected_salary_range'], $data['notice_period'], $storedName,
        $data['why_change'], $data['source'], $data['institute'],
    ];
    $districtColumn = $db->query("SHOW COLUMNS FROM `applicant` LIKE 'district'");
    if ($districtColumn instanceof mysqli_result && $districtColumn->num_rows > 0) {
        array_splice($baseColumns, 8, 0, ['district']);
        array_splice($baseValues, 8, 0, [$data['district']]);
    }
    if ($districtColumn instanceof mysqli_result) $districtColumn->free();
    $quotedColumns = array_map(static fn(string $column): string => '`' . $column . '`', $baseColumns);
    $sql = 'INSERT INTO `applicant` (' . implode(',', [...$quotedColumns, '`created_at`']) . ') VALUES (' . implode(',', array_fill(0, count($baseValues), '?')) . ',NOW())';
    $stmt = $db->prepare($sql);
    $bindArguments = [str_repeat('s', count($baseValues))];
    foreach ($baseValues as &$baseValue) $bindArguments[] = &$baseValue;
    call_user_func_array([$stmt, 'bind_param'], $bindArguments);
    unset($baseValue);
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
        'district' => $data['district'],
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
