<?php

$servername = "localhost";
$username = "phplogin";
$password = "phppass";
$dbname = "csslearn";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
    echo "Connection error";
}

$newlogin = $_POST['newlogin'];
$newpassword = $_POST['newpassword'];
$newpassword = password_hash($newpassword, PASSWORD_DEFAULT);

if (strlen($newlogin) <= 60) {
    $checkQuery = "SELECT * FROM users WHERE Login = ?";
    $stmt = $conn->prepare($checkQuery);
    $stmt->bind_param("s", $newlogin);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 0) {
        $insertQuery = "INSERT INTO users (Login, Password, Level) VALUES (?, ?, 1)";
        $insertStmt = $conn->prepare($insertQuery);
        $insertStmt->bind_param("ss", $newlogin, $newpassword);
        $insertStmt->execute();
	    setcookie('signtoken', $newlogin, time() + 86400 * 7, '/');
	    echo "1lev.html";
    } else {
        echo "Логин занят!";
        exit();
    }
    $stmt->close();
    $insertStmt->close();
} else {
    echo "Логин должен быть короче 60 символов!";
    exit();
}

$conn->close();
exit();
?>
