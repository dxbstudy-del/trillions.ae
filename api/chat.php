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
    send_reply(503, 'The Trillions AI assistant is prepared but the server API key is not configured yet.');
}

$payload = [
    'model' => 'gpt-4.1-mini',
    'messages' => [
        [
            'role' => 'system',
            'content' => 'You are the Trillions website assistant. Help visitors with sourcing, supplier comparison, private label product development, product inquiry preparation, and GCC import planning. Do not give legal, financial, or compliance guarantees. Ask for product details, quantity, destination, target price, documents, and supplier information when needed.'
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
        send_reply(503, 'The AI assistant is online, but the AI service account needs credits or billing updated. Please use the contact form while this is fixed.');
    }

    send_reply(502, 'The assistant could not connect to the AI service right now. Please try again later.');
}

if (!is_array($data)) {
    send_reply(502, 'The assistant returned an unreadable response. Please try again later.');
}

$reply = $data['choices'][0]['message']['content'] ?? 'No reply was generated.';
echo json_encode(['reply' => $reply]);
