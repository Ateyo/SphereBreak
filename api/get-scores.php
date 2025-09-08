<?php
require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

header('Content-Type: application/json');
// header('Access-Control-Allow-Origin: https://tom-gonzalez.com'); // PROD
header('Access-Control-Allow-Origin: http://localhost:4200'); // DEV
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Add POST for save-score.php
header('Access-Control-Allow-Headers: Content-Type, X-API-Key'); // Allow custom header

// Handle OPTIONS request for CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Check for API Key
if (!isset($_SERVER['HTTP_X_API_KEY']) || $_SERVER['HTTP_X_API_KEY'] !== $_ENV['API_KEY']) {
    http_response_code(401); // Unauthorized
    echo json_encode(['error' => 'Unauthorized API access.']);
    exit();
}

$dbPath = '../highscores.db'; // Path to your SQLite database file

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

    // Check if the table is empty
    $stmt = $db->query('SELECT COUNT(*) FROM highscores');
    $count = $stmt->fetchColumn();

    // If empty, insert a dummy score
    if ($count == 0) {
        $db->exec("INSERT INTO highscores (initials, score, level) VALUES ('TOM', 1500, 2)");
    }

    $stmt = $db->query('SELECT initials, score, level FROM highscores ORDER BY score DESC LIMIT 10');
    $highscores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($highscores);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>