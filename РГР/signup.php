<?php
// Database connection parameters
$servername = "localhost";
$username = "phplogin";
$password = "phppass";
$dbname = "csslearn";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$newlogin = $_POST['newlogin'];
$newpassword = $_POST['newpassword'];

if (strlen($newlogin) <= 60) {
    $checkQuery = "SELECT * FROM users WHERE Login = ?";
    $stmt = $conn->prepare($checkQuery);
    $stmt->bind_param("s", $newlogin);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 0) {
        // Insert the values into the users table
        $insertQuery = "INSERT INTO users (Login, Password, Level) VALUES (?, ?, 1)";
        $insertStmt = $conn->prepare($insertQuery);
        $insertStmt->bind_param("ss", $newlogin, $newpassword);
        $insertStmt->execute();

        echo "Values inserted successfully.";
    } else {
        echo "Login already exists.";
    }

    $stmt->close();
    $insertStmt->close();
} else {
    echo "Login should be less than 60 characters.";
}

$conn->close();
?>