<?php
session_start();

$servername = "localhost";
$username = "phplogin";
$password = "phppass";
$dbname = "csslearn";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (isset($_COOKIE['signtoken'])) {
    $setquery = "SELECT * FROM users WHERE Login = ?";
    $setstmt = $conn->prepare($setquery);
    $setstmt->bind_param("s", $_COOKIE['signtoken']);
    $setstmt->execute();
    $setresult = $setstmt->get_result();
    $row = $setresult->fetch_assoc();
    $level = $row['Level'];
    $params = "?login=" . urlencode($_COOKIE['signtoken']) . "&level=" . urlencode($level);
    $redirectUrl = $level . "lev.html";
    echo $redirectUrl . $params;
    exit(); 
}

elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $login = $_POST['login'];
    $password = $_POST['password'];

    $query = "SELECT * FROM users WHERE Login = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $login);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        $hashedPassword = $row['Password'];
        if (password_verify($password, $hashedPassword)) {
            setcookie('signtoken', $login, time() + 86400, '/');
            echo "Authentication successful. You are now logged in.";
            $level = $row['Level'];
            $params = "?login=" . urlencode($login) . "&level=" . urlencode($level);
            $redirectUrl = $level . "lev.html";
            header("Location: " . $redirectUrl . $params);
            exit();
        }
        else {
            echo "Authentication failed. Invalid login or password.";
            exit();
        }
    } 
    else {
        echo "Authentication failed. Invalid login or password.";
        exit();
    }
}

$stmt->close();
$conn->close();
?>
