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

function inputText(array $input, string $key): string
{
    $value = $input[$key] ?? '';
    return trim(is_string($value) || is_numeric($value) ? (string)$value : '');
}

function textLength(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['success' => false, 'message' => 'POST method required.']);
}

$contentType = strtolower((string)($_SERVER['CONTENT_TYPE'] ?? ''));
if (!str_contains($contentType, 'application/json')) {
    respond(415, ['success' => false, 'message' => 'Send the form as JSON.']);
}

$rawBody = file_get_contents('php://input');
if ($rawBody === false || strlen($rawBody) > 100 * 1024) {
    respond(413, ['success' => false, 'message' => 'Request is too large.']);
}
$input = json_decode($rawBody, true);
if (!is_array($input)) respond(400, ['success' => false, 'message' => 'Invalid JSON request.']);

$name = inputText($input, 'studentName') ?: inputText($input, 'name');
$mobile = inputText($input, 'mobileNumber') ?: inputText($input, 'mobile');
$email = strtolower(inputText($input, 'email'));
$locationParts = [];
foreach (['city', 'district', 'state', 'country'] as $locationKey) {
    $part = inputText($input, $locationKey);
    if ($part !== '') $locationParts[] = $part;
}
$location = implode(', ', $locationParts);
$level = inputText($input, 'course');
$department = inputText($input, 'department');
$message = inputText($input, 'remarks') ?: inputText($input, 'message');
$other = inputText($input, 'other') ?: (inputText($input, 'source') ?: 'Website');
$previousQualification = inputText($input, 'previousQualification');
$courseLevel = trim($level . ($department !== '' ? ' - ' . $department : ''));
$academicMarks = inputText($input, 'academicQualificationMarks');

$required = [
    'name' => $name,
    'mobile' => $mobile,
    'email' => $email,
    'location' => $location,
    'course' => $level,
    'message' => $message,
    'other' => $other,
];
$missing = array_keys(array_filter($required, static fn(string $value): bool => $value === ''));
if ($missing) respond(422, ['success' => false, 'message' => 'Please complete all required fields.', 'fields' => $missing]);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(422, ['success' => false, 'message' => 'Enter a valid email address.']);
if (!preg_match('/^[0-9+() -]{7,20}$/', $mobile)) respond(422, ['success' => false, 'message' => 'Enter a valid mobile number.']);
if (($input['consent'] ?? false) !== true) respond(422, ['success' => false, 'message' => 'Please provide consent to submit your enquiry.']);

$limits = [
    'name' => 50,
    'mobile' => 20,
    'email' => 50,
    'location' => 50,
    'course' => 30,
    'other' => 30,
    'previous_qualification' => 150,
    'course_level' => 100,
    'academic_qualification_marks' => 150,
];
$valuesToCheck = [
    'name' => $name,
    'mobile' => $mobile,
    'email' => $email,
    'location' => $location,
    'course' => $level,
    'other' => $other,
    'previous_qualification' => $previousQualification,
    'course_level' => $courseLevel,
    'academic_qualification_marks' => $academicMarks,
];
$tooLong = [];
foreach ($limits as $field => $limit) {
    if (textLength($valuesToCheck[$field]) > $limit) $tooLong[] = $field;
}
if ($tooLong) respond(422, ['success' => false, 'message' => 'Some answers exceed the database field limits. Please shorten them and try again.', 'fields' => $tooLong]);

$publicHtmlDirectory = basename(dirname(__DIR__)) === 'new-site' ? dirname(__DIR__, 2) : dirname(__DIR__);
$legacyConfigPath = $publicHtmlDirectory . '/webportal/masterdb_config.php';
if (!is_file($legacyConfigPath)) {
    error_log('Apply API could not find public_html/webportal/masterdb_config.php.');
    respond(500, ['success' => false, 'message' => 'Admission enquiry database connection is not configured.']);
}

try {
    require_once $legacyConfigPath;
    if (!isset($masterdb_con) || !($masterdb_con instanceof mysqli)) {
        error_log('Apply API masterdb_config.php did not provide a mysqli connection named $masterdb_con.');
        respond(500, ['success' => false, 'message' => 'Admission enquiry database connection is unavailable.']);
    }
    $masterdb_con->set_charset('utf8mb4');
    $sql = 'INSERT INTO `application` (`name`,`mobile`,`email`,`location`,`course`,`message`,`other`,`previous_qualification`,`course_level`,`academic_qualification_marks`) VALUES (?,?,?,?,?,?,?,?,?,?)';
    $stmt = $masterdb_con->prepare($sql);
    $stmt->bind_param('ssssssssss', $name, $mobile, $email, $location, $level, $message, $other, $previousQualification, $courseLevel, $academicMarks);
    $stmt->execute();
    $id = (int)$stmt->insert_id;

    respond(201, [
        'success' => true,
        'message' => 'Your admission enquiry has been submitted successfully. Our admissions team will contact you shortly.',
        'id' => $id,
        'data' => [
            'id' => $id,
            'studentName' => $name,
            'mobileNumber' => $mobile,
            'course' => $level,
            'department' => $department,
        ],
    ]);
} catch (Throwable $error) {
    error_log('Admission enquiry insert failed: ' . $error->getMessage());
    respond(500, ['success' => false, 'message' => 'Unable to save your admission enquiry. Please try again.']);
}
