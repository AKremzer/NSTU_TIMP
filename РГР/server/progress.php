<?php

$servername = "localhost";
$username = "phplogin";
$password = "phppass";
$dbname = "csslearn";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

if (isset($_POST['signtoken'])) {
    $signtoken = $_POST['signtoken'];
    $query = "SELECT Level FROM users WHERE Login = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $signtoken);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        $level = $row['Level'];
        echo $level;
    }
    else {
        echo "Level not found";
    }
    $stmt->close();
    $conn->close();
}

elseif (isset($_POST['winlogin'])) {
    $login = $_POST['winlogin'];
    $query = "SELECT Level FROM users WHERE Login = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $login);
    $stmt->execute();
    $stmt->bind_result($currentLevel);
    $stmt->fetch();
    $stmt->close();

    if ($currentLevel != 20) {
        $currentLevel = $currentLevel + 1;
        $updateQuery = "UPDATE users SET Level = ? WHERE Login = ?";
        $updateStmt = $conn->prepare($updateQuery);
        $updateStmt->bind_param("is", $currentLevel, $login);
        $updateStmt->execute();
        $updateStmt->close();
        echo $currentLevel;
    }
    else {
        echo "win";
    }
    $conn->close();
}
?>