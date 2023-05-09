<?php
$servername = "localhost";
$username = "phplogin";
$password = "phppass";
$dbname = "csslearn";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

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
        $cookie_name = "auth_token";
        $cookie_value = $login;
        setcookie($cookie_name, $cookie_value, time() + (86400 * 7), "/"); // куки на неделю
        echo "Authentication successful. You are now logged in.";
        $level = $row['Level'];
        $redirectUrl = $level . "lev.html";
        header("Location: " . $redirectUrl);
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
$stmt->close();
$conn->close();
exit();
?>