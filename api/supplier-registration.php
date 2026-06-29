<?php
header('Content-Type: application/json');

const SUPPLIER_REGISTRATION_EMAIL = 'info@trillions.ae';

function send_reply($status, $reply) {
    http_response_code($status);
    echo json_encode(['reply' => $reply]);
    exit;
}

function clean_text($value, $limit = 1200) {
    if (!is_string($value)) {
        return '';
    }

    $value = strip_tags($value);
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    $value = preg_replace('/[ \t]+/', ' ', $value);
    $value = preg_replace('/\n{3,}/', "\n\n", $value);
    $value = trim($value);

    if (strlen($value) > $limit) {
        $value = substr($value, 0, $limit) . '...';
    }

    return $value;
}

function clean_header($value, $limit = 120) {
    $value = clean_text($value, $limit);
    return str_replace(["\n", "\r"], ' ', $value);
}

function line_item($label, $value) {
    return $label . ': ' . ($value !== '' ? $value : 'Not provided');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_reply(405, 'Method not allowed.');
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    send_reply(400, 'Invalid request. Please try again.');
}

$company = clean_text($input['company'] ?? '', 180);
$supplierType = clean_text($input['supplier_type'] ?? '', 80);
$countryCity = clean_text($input['country_city'] ?? '', 180);
$contactName = clean_text($input['contact_name'] ?? '', 180);
$email = clean_header($input['email'] ?? '', 180);
$phone = clean_text($input['phone'] ?? '', 120);
$website = clean_text($input['website'] ?? '', 400);
$categories = clean_text($input['categories'] ?? '', 600);
$moq = clean_text($input['moq'] ?? '', 180);
$leadTime = clean_text($input['lead_time'] ?? '', 180);
$paymentTerms = clean_text($input['payment_terms'] ?? '', 180);
$exportMarkets = clean_text($input['export_markets'] ?? '', 600);
$documents = clean_text($input['documents'] ?? '', 600);
$topProducts = clean_text($input['top_products'] ?? '', 4000);
$address = clean_text($input['address'] ?? '', 2000);
$message = clean_text($input['message'] ?? '', 4000);

if ($company === '' || $countryCity === '' || $contactName === '' || $email === '' || $categories === '' || $topProducts === '') {
    send_reply(400, 'Please complete company name, country and city, contact person, email, product categories, and top products.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_reply(400, 'Please enter a valid email address.');
}

$allowedTypes = ['Manufacturer', 'Wholesaler', 'Exporter', 'Trading company'];
if (!in_array($supplierType, $allowedTypes, true)) {
    $supplierType = 'Not provided';
}

$submittedAt = gmdate('Y-m-d H:i:s') . ' UTC';
$remoteAddress = clean_text($_SERVER['REMOTE_ADDR'] ?? '', 80);
$userAgent = clean_text($_SERVER['HTTP_USER_AGENT'] ?? '', 300);
$subjectCompany = clean_header($company, 80);
$subject = 'Trillions supplier registration from ' . ($subjectCompany !== '' ? $subjectCompany : 'website supplier');

$body = implode("\n", [
    'New supplier registration submitted from trillions.ae',
    '',
    'Company details',
    line_item('Company name', $company),
    line_item('Supplier type', $supplierType),
    line_item('Country and city', $countryCity),
    line_item('Factory or warehouse address', $address),
    '',
    'Contact details',
    line_item('Contact person', $contactName),
    line_item('Email', $email),
    line_item('Phone or WhatsApp', $phone),
    line_item('Website or catalog link', $website),
    '',
    'Product and commercial details',
    line_item('Product categories', $categories),
    line_item('Top products', $topProducts),
    line_item('MOQ range', $moq),
    line_item('Lead time', $leadTime),
    line_item('Payment terms', $paymentTerms),
    line_item('Export markets', $exportMarkets),
    line_item('Documents available', $documents),
    '',
    'Why buyers should consider this company',
    $message !== '' ? $message : 'Not provided',
    '',
    'Submission details',
    line_item('Submitted at', $submittedAt),
    line_item('IP address', $remoteAddress),
    line_item('Browser', $userAgent),
]);

$headers = implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Trillions Website <info@trillions.ae>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
]);

$sent = mail(SUPPLIER_REGISTRATION_EMAIL, $subject, $body, $headers);

if (!$sent) {
    send_reply(502, 'The registration could not be sent automatically. Please email info@trillions.ae directly.');
}

send_reply(200, 'Supplier registration sent to Trillions. Thank you.');
