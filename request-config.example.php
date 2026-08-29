<?php
// Copy the values into server environment variables. Do not publish real passwords.
return [
    'admin_email' => getenv('ALBRIGHTON_ADMIN_EMAIL') ?: 'albrightonengineeringco.ltd@gmail.com',
    'admin_phones' => ['256776105168', '256780743968'],
    'egosms' => [
        'endpoint' => 'https://www.egosms.co/api/v1/plain/',
        'username' => getenv('EGOSMS_USERNAME') ?: '',
        'password' => getenv('EGOSMS_PASSWORD') ?: '',
        'sender' => getenv('EGOSMS_SENDER') ?: '',
    ],
    'smtp' => [
        'host' => getenv('SMTP_HOST') ?: 'mail.smtp2go.com',
        'port' => (int) (getenv('SMTP_PORT') ?: 465),
        'encryption' => getenv('SMTP_ENCRYPTION') ?: 'ssl',
        'username' => getenv('SMTP_USERNAME') ?: '',
        'password' => getenv('SMTP_PASSWORD') ?: '',
        'from_email' => getenv('SMTP_FROM_EMAIL') ?: 'info@binena.net',
        'from_name' => getenv('SMTP_FROM_NAME') ?: 'Binena Limited',
    ],
];
