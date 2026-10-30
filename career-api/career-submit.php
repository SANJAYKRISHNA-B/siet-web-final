<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

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
 * 2. Otherwise load a private config using CAREER_CONFIG_PATH.
 * This lets the uploaded handler work with the database connection already used
 * by the legacy recruitment page without exposing credentials in this folder.
 */
$config = [];
$db = null;
$publicHtmlDirectory = basename(dirname(__DIR__)) === 'new-site' ? dirname(__DIR__, 2) : dirname(__DIR__);
$legacyConfigPath = $publicHtmlDirectory . '/webportal/masterdb_config.php';
if (is_file($legacyConfigPath)) {
    require_once $legacyConfigPath;
    if (isset($masterdb_con) && $masterdb_con instanceof mysqli) {
        $db = $masterdb_con;
    }
}

if (!$db) {
    $configPath = getenv('CAREER_CONFIG_PATH') ?: __DIR__ . '/career-config.php';
    if (!is_file($configPath)) {
        error_log('Career API database configuration was not found.');
        respond(500, ['success' => false, 'message' => 'Career service database is not configured.']);
    }
    $config = require $configPath;
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

function notifyCareerMailer(array $application, array $config): bool
{
    $url = getenv('CAREER_MAIL_WEBHOOK_URL') ?: ($config['mail_webhook_url'] ?? '');
    $token = getenv('CAREER_MAIL_WEBHOOK_TOKEN') ?: ($config['mail_webhook_token'] ?? '');
    if ($url === '' || $token === '' || !function_exists('curl_init')) return false;

    $curl = curl_init((string)$url);
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 2,
        CURLOPT_TIMEOUT => 6,
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
    $applicationNo = 'SIET-CAR-' . date('Y') . '-' . str_pad((string)$id, 6, '0', STR_PAD_LEFT);
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
