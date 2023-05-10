<?php

$servername = "localhost";
$username = "phplogin";
$password = "phppass";
$dbname = "csslearn";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$levelNumber = $_POST['level'];

$query = "SELECT Answer FROM levels WHERE ID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $levelNumber);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $answer = $row['Answer'];
    echo $answer;
}
else {
    echo "Answer not found";
}

$stmt->close();
$conn->close();
?>