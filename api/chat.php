<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['reply' => 'Method not allowed.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$message = trim($input['message'] ?? '');

if ($message === '') {
    http_response_code(400);
    echo json_encode(['reply' => 'Please enter a message.']);
    exit;
}

$apiKey = getenv('OPENAI_API_KEY');
if (!$apiKey) {
    http_response_code(503);
    echo json_encode(['reply' => 'The Trillions AI assistant is prepared but the server API key is not configured yet.']);
    exit;
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

if ($response === false || $status < 200 || $status >= 300) {
    http_response_code(502);
    echo json_encode(['reply' => 'The assistant could not connect to the AI service right now. Please try again later.']);
    exit;
}

$data = json_decode($response, true);
$reply = $data['choices'][0]['message']['content'] ?? 'No reply was generated.';
echo json_encode(['reply' => $reply]);
