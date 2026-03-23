<?php
// Configuración: Reemplaza estos valores con tu información real
$destinatario = "susanaledesma91@gmail.com"; 
$asunto = "Nuevo Pedido/Consulta desde Multi digital Web";
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
// Reemplaza el remitente por un correo de tu dominio para evitar ser marcado como spam
$headers .= 'From: Web Multi digital <no-responder@tudominio.com>' . "\r\n";

// 1. Verificar si la solicitud es un método POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 2. Limpiar y obtener los datos enviados desde el formulario (Front-end)
    $nombre = htmlspecialchars(trim($_POST['nombre']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $mensaje = htmlspecialchars(trim($_POST['mensaje']));

    // 3. Validaciones básicas
    if (empty($nombre) OR empty($mensaje) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Enviar una respuesta de error al Front-end
        http_response_code(400); 
        echo "Por favor, completa el formulario correctamente.";
        exit;
    }

    // 4. Construir el cuerpo del mensaje
    $contenido = "
        <html>
        <head>
          <title>Nuevo Mensaje de Contacto</title>
        </head>
        <body>
          <h2>Detalles de la Consulta</h2>
          <p><strong>Nombre:</strong> {$nombre}</p>
          <p><strong>Email:</strong> {$email}</p>
          <p><strong>Mensaje:</strong> <br> {$mensaje}</p>
          <hr>
          <p>Enviado desde el sitio web Multi digital.</p>
        </body>
        </html>
    ";

    // 5. Enviar el correo electrónico
    if (mail($destinatario, $asunto, $contenido, $headers)) {
        // Éxito: Enviar una respuesta de éxito al Front-end
        http_response_code(200);
        echo "¡Gracias! Tu mensaje ha sido enviado con éxito.";
    } else {
        // Error: Si el servidor no pudo enviar el correo
        http_response_code(500);
        echo "Lo sentimos, hubo un problema y no pudimos enviar tu mensaje.";
    }

} else {
    // Si alguien intenta acceder directamente al archivo PHP
    http_response_code(403);
    echo "Acceso Denegado.";
}
?>