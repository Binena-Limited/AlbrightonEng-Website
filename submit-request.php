<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
date_default_timezone_set('Africa/Nairobi');

$config = require __DIR__ . '/request-config.example.php';

function clean(string $key, int $max = 1200): string {
    $value = trim((string)($_POST[$key] ?? ''));
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
    return mb_substr($value, 0, $max);
}
function smtpCommand($socket, string $command, array $codes): bool {
    if ($command !== '') fwrite($socket, $command . "\r\n");
    $response = '';
    do {
        $line = fgets($socket, 515);
        if ($line === false) break;
        $response .= $line;
    } while (isset($line[3]) && $line[3] === '-');
    return in_array((int)substr($response, 0, 3), $codes, true);
}
function sendSmtp(array $smtp, string $to, string $subject, string $body, string $replyTo): bool {
    if ($smtp['username'] === '' || $smtp['password'] === '') return false;
    $transport = $smtp['encryption'] === 'ssl' ? 'ssl://' : '';
    $socket = @fsockopen($transport . $smtp['host'], $smtp['port'], $errno, $errstr, 12);
    if (!$socket || !smtpCommand($socket, '', [220])) return false;
    $host = $_SERVER['SERVER_NAME'] ?? 'albrighton.local';
    if (!smtpCommand($socket, 'EHLO ' . $host, [250])) return false;
    if (!smtpCommand($socket, 'AUTH LOGIN', [334]) ||
        !smtpCommand($socket, base64_encode($smtp['username']), [334]) ||
        !smtpCommand($socket, base64_encode($smtp['password']), [235])) return false;
    if (!smtpCommand($socket, 'MAIL FROM:<' . $smtp['from_email'] . '>', [250]) ||
        !smtpCommand($socket, 'RCPT TO:<' . $to . '>', [250,251]) ||
        !smtpCommand($socket, 'DATA', [354])) return false;
    $headers = [
        'From: ' . $smtp['from_name'] . ' <' . $smtp['from_email'] . '>',
        'To: <' . $to . '>',
        'Reply-To: <' . $replyTo . '>',
        'Subject: ' . $subject,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
    ];
    $payload = implode("\r\n", $headers) . "\r\n\r\n" . str_replace("\n.", "\n..", $body) . "\r\n.";
    $ok = smtpCommand($socket, $payload, [250]);
    smtpCommand($socket, 'QUIT', [221]);
    fclose($socket);
    return $ok;
}
function sendSms(array $sms, string $number, string $message): bool {
    if ($sms['username'] === '' || $sms['password'] === '' || $sms['sender'] === '') return false;
    $url = $sms['endpoint'] . '?' . http_build_query([
        'number' => $number, 'message' => mb_substr($message, 0, 600),
        'username' => $sms['username'], 'password' => $sms['password'],
        'sender' => $sms['sender'], 'priority' => 0,
    ]);
    if (function_exists('curl_init')) {
        $ch = curl_init($url); curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER=>true,CURLOPT_TIMEOUT=>12,CURLOPT_SSL_VERIFYPEER=>true]);
        $result = curl_exec($ch); $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
        return $result !== false && $code >= 200 && $code < 300;
    }
    return @file_get_contents($url) !== false;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false,'message'=>'Method not allowed']); exit; }
if (!empty($_POST['website'])) { echo json_encode(['ok'=>true]); exit; }
$type = clean('request_type', 50) ?: 'Contact inquiry';
$name = clean('name', 120); $phone = clean('phone', 40); $email = filter_var(clean('email', 180), FILTER_VALIDATE_EMAIL) ?: '';
if ($name === '' || $phone === '') { http_response_code(422); echo json_encode(['ok'=>false,'message'=>'Name and phone number are required.']); exit; }
$fields = ['product','quantity','service','project_location','preferred_date','budget','message'];
$labels = ['product'=>'Product','quantity'=>'Quantity','service'=>'Service','project_location'=>'Project location','preferred_date'=>'Preferred date','budget'=>'Budget / range','message'=>'Details'];
$lines = ['ALBRIGHTON ENGINEERING REQUEST','Type: '.$type,'Name: '.$name,'Phone: '.$phone,'Email: '.($email ?: 'Not provided')];
foreach ($fields as $field) { $value=clean($field); if ($value!=='') $lines[]=$labels[$field].': '.$value; }
$lines[]='Submitted: '.date('Y-m-d H:i:s T');
$body = implode("\n", $lines); $subject = 'Albrighton: ' . $type . ' from ' . $name;
$emailOk = sendSmtp($config['smtp'], $config['admin_email'], $subject, $body, $email ?: $config['smtp']['from_email']);
$smsResults=[]; foreach($config['admin_phones'] as $adminPhone) $smsResults[$adminPhone]=sendSms($config['egosms'],$adminPhone,$body);
$wa=[]; foreach($config['admin_phones'] as $adminPhone) $wa[]='https://wa.me/'.$adminPhone.'?text='.rawurlencode($body);
echo json_encode(['ok'=>true,'message'=>'Your request has been prepared and submitted.','email_sent'=>$emailOk,'sms_sent'=>$smsResults,'whatsapp'=>$wa]);
