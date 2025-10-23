<?php
require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

header('Content-Type: application/json');
// header('Access-Control-Allow-Origin: https://tom-gonzalez.com'); // PROD
header('Access-Control-Allow-Origin: http://localhost:4200'); // DEV
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-API-Key'); // Allow custom header

// Handle OPTIONS request for CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Check for API Key
if (!isset($_SERVER['HTTP_X_API_KEY']) || !hash_equals($_ENV['API_KEY'], $_SERVER['HTTP_X_API_KEY'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['error' => 'Unauthorized API access.']);
    exit();
}

$dbPath = __DIR__ . '/../highscores.db'; // Path to your SQLite database file

$input = json_decode(file_get_contents('php://input'), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON format.']);
    exit();
}

// Basic input validation
if (!isset($input['initials']) || !isset($input['score']) || !isset($input['level'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields (initials, score, level).']);
    exit();
}

// Validate that score and level are numeric before casting
if (!is_numeric($input['score']) || !is_numeric($input['level'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Score and level must be numeric.']);
    exit();
}

$initials = strtoupper(trim($input['initials']));
$score = (int)$input['score'];
$level = (int)$input['level'];

// Further validation for initials (3 uppercase letters)
if (!preg_match('/^[A-Z]{3}$/', $initials)) {
    http_response_code(400);
    echo json_encode(['error' => 'Initials must be 3 uppercase letters.']);
    exit();
}

// Ensure score and level are non-negative
if ($score < 0 || $level < 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Score and level must be non-negative integers.']);
    exit();
}

try {
    $db = new PDO('sqlite:' . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create table if it doesn't exist
    $db->exec('CREATE TABLE IF NOT EXISTS highscores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        initials TEXT NOT NULL,
        score INTEGER NOT NULL,
        level INTEGER NOT NULL
    )');
} catch (PDOException $e) {
    // Log the full error for internal diagnostics
    error_log('Database error in save-score.php: ' . $e->getMessage());

    http_response_code(500);

    // In development reveal details, otherwise return a generic message
    $errorMessage = ($_ENV['APP_ENV'] ?? 'production') === 'development'
        ? 'Database error: ' . $e->getMessage()
        : 'An internal server error occurred.';
    echo json_encode(['error' => $errorMessage]);
}

    // Keep only the top 10 scores
    $db->exec('DELETE FROM highscores WHERE id NOT IN (SELECT id FROM highscores ORDER BY score DESC LIMIT 10)');

    // Fetch and return the top 10 scores
    $stmt = $db->query('SELECT initials, score, level FROM highscores ORDER BY score DESC LIMIT 10');
    $updatedHighscores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['message' => 'High score added successfully.', 'highscores' => $updatedHighscores]);
?>