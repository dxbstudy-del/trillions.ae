<?php
header('Content-Type: application/json');

function send_reply($status, $reply) {
    http_response_code($status);
    echo json_encode(['reply' => $reply]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_reply(405, 'Method not allowed.');
}

$input = json_decode(file_get_contents('php://input'), true);
$message = trim($input['message'] ?? '');

if ($message === '') {
    send_reply(400, 'Please enter a message.');
}

$apiKey = getenv('OPENAI_API_KEY');
if (!$apiKey) {
    send_reply(503, 'The Trillions AI assistant is temporarily unavailable. Please use the contact page to send your sourcing inquiry.');
}

$payload = [
    'model' => 'gpt-4.1-mini',
    'messages' => [
        [
            'role' => 'system',
            'content' => 'You are the Trillions website AI assistant for UAE and GCC sourcing inquiry preparation. Your main job is to help visitors create a stronger formal inquiry for Trillions. Help with product requirements, supplier quote review, supplier follow-up questions, private-label preparation, packaging questions, sample planning, document gaps, and GCC market considerations. If the visitor gives vague information, ask for the product/category, target quantity, destination country or city, target price or budget, supplier name or link, quotation terms, lead time, MOQ, documents, packaging needs, and timeline. When enough detail is available, produce a concise structured brief with these headings: Product or category, Buying target, Supplier or quote details, Missing information, Supplier follow-up questions, Recommended next step. Be clear that you cannot provide live quotations, guarantee supplier availability, verify factories or documents by yourself, approve compliance/customs/legal/tax matters, or replace formal quotation review, sample checks, or import coordination. Encourage visitors to send a formal inquiry to Trillions for verified review.'
        ],
        [
            'role' => 'user',
            'content' => $message
        ]
    ],
    'temperature' => 0.3
];

$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey
    ],
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_TIMEOUT => 30
]);

$response = curl_exec($ch);
$error = curl_error($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false) {
    send_reply(502, 'The assistant could not connect to the AI service right now. Please try again later.');
}

$data = json_decode($response, true);

if ($status < 200 || $status >= 300) {
    $providerText = '';
    if (is_array($data) && isset($data['error'])) {
        $providerText = implode(' ', array_filter([
            $data['error']['message'] ?? '',
            $data['error']['type'] ?? '',
            $data['error']['code'] ?? ''
        ]));
    }

    if (preg_match('/quota|billing|credit|insufficient|exceeded/i', $providerText)) {
        send_reply(503, 'The Trillions AI assistant is temporarily unavailable. Please use the contact page to send your sourcing inquiry.');
    }

    send_reply(502, 'The assistant could not connect to the AI service right now. Please try again later.');
}

if (!is_array($data)) {
    send_reply(502, 'The assistant returned an unreadable response. Please try again later.');
}

$reply = $data['choices'][0]['message']['content'] ?? 'No reply was generated.';
echo json_encode(['reply' => $reply]);
