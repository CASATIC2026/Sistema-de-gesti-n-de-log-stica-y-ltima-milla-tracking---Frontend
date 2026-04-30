<?php
// Datos de tu servidor y base de datos
$servername = "localhost";   // o la IP de tu servidor
$username   = "tu_usuario";  // usuario de la base de datos
$password   = "tu_contraseña"; // contraseña del usuario
$database   = "nombre_de_tu_base"; // nombre de la base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

echo "Conexión exitosa a la base de datos";
?>
