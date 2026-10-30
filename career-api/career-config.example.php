<?php
/**
 * Copy this file OUTSIDE public_html, for example:
 * /home/CPANEL_USER/private/career-config.php
 * Then update CAREER_CONFIG_PATH in career-submit.php.
 */
return [
    'db_host' => 'localhost',
    'db_port' => 3306,
    'db_name' => 'CPANEL_USER_database_name',
    'db_user' => 'CPANEL_USER_database_user',
    'db_pass' => 'REPLACE_WITH_DATABASE_PASSWORD',
    'upload_dir' => dirname(__DIR__, 2) . '/webportal/resume',
    'max_upload_bytes' => 2 * 1024 * 1024,
    'mail_webhook_url' => 'https://YOUR-NODE-APP-URL/career-submission',
    'mail_webhook_token' => 'REPLACE_WITH_THE_SAME_LONG_RANDOM_SECRET',
];
