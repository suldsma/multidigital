// ==========================================
// MULTI DIGITAL - JAVASCRIPT
// ==========================================

// Obtenemos los elementos del DOM
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const btnAgregar = document.querySelectorAll('.btn-agregar');

// ==========================================
// 1. FUNCIONALIDAD DEL MENÚ RESPONSIVO
// ==========================================

if (menuToggle && navMenu) {
    // Toggle del menú al hacer clic en el botón hamburguesa
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animación del botón hamburguesa
        const spans = menuToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Cerrar el menú al hacer clic en un enlace (en móvil)
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            // Resetear animación del botón
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// ==========================================
// 2. SCROLL SUAVE PARA ENLACES INTERNOS
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// 3. FUNCIONALIDAD BOTONES "CONSULTAR"
// ==========================================

btnAgregar.forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.producto-card');
        const producto = card.querySelector('h3').textContent;
        const precio = card.querySelector('.precio').textContent;
        
        // Scroll a la sección de contacto
        const contactoSection = document.getElementById('contacto');
        contactoSection.scrollIntoView({ behavior: 'smooth' });
        
        // Pre-llenar el mensaje
        setTimeout(() => {
            const mensajeField = document.getElementById('mensaje');
            if (mensajeField) {
                mensajeField.value = `Hola! Me interesa el producto: ${producto} (${precio}). Me gustaría más información.`;
                mensajeField.focus();
            }
        }, 500);
    });
});

// ==========================================
// 4. FORMULARIO DE CONTACTO
// ==========================================

if (contactForm && formMessage) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Detiene el envío estándar

        // Obtener los valores del formulario
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        // Validación básica
        if (!nombre || !email || !mensaje) {
            mostrarMensaje('Por favor completa todos los campos', 'error');
            return;
        }

        if (!validarEmail(email)) {
            mostrarMensaje('Por favor ingresa un email válido', 'error');
            return;
        }

        // Simular envío (aquí irías con tu backend real)
        simularEnvio(nombre, email, mensaje);
    });
}

// Función para validar email
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Función para simular el envío del formulario
function simularEnvio(nombre, email, mensaje) {
    // Mostrar mensaje de cargando
    formMessage.style.color = '#5d0f6b';
    formMessage.textContent = 'Enviando mensaje...';
    formMessage.style.display = 'block';

    // Simular delay de servidor (2 segundos)
    setTimeout(() => {
        // Simular respuesta exitosa
        const exito = Math.random() > 0.1; // 90% de éxito

        if (exito) {
            mostrarMensaje('✅ ¡Mensaje enviado correctamente! Te responderemos pronto.', 'exito');
            contactForm.reset(); // Limpiar formulario
            
            // Aquí guardarías en tu base de datos o enviarías por email
            console.log('Datos del formulario:', { nombre, email, mensaje });
        } else {
            mostrarMensaje('❌ Error al enviar el mensaje. Por favor intenta nuevamente.', 'error');
        }
    }, 2000);
}

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo) {
    formMessage.textContent = texto;
    formMessage.style.display = 'block';
    
    if (tipo === 'exito') {
        formMessage.style.backgroundColor = '#d4edda';
        formMessage.style.color = '#155724';
        formMessage.style.border = '1px solid #c3e6cb';
    } else if (tipo === 'error') {
        formMessage.style.backgroundColor = '#f8d7da';
        formMessage.style.color = '#721c24';
        formMessage.style.border = '1px solid #f5c6cb';
    }
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// ==========================================
// 5. ANIMACIONES AL HACER SCROLL
// ==========================================

// Observer para animaciones al entrar en viewport
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animación a las tarjetas de productos
document.querySelectorAll('.producto-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Aplicar animación a los pasos
document.querySelectorAll('.paso').forEach((paso, index) => {
    paso.style.opacity = '0';
    paso.style.transform = 'translateY(30px)';
    paso.style.transition = `all 0.6s ease ${index * 0.15}s`;
    observer.observe(paso);
});

// ==========================================
// 6. INTEGRACIÓN CON BACKEND REAL (EJEMPLO)
// ==========================================

// Si tienes un archivo PHP para enviar emails, descomenta esto:
/*
function enviarConPHP(nombre, email, mensaje) {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('email', email);
    formData.append('mensaje', mensaje);

    fetch('enviar.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => Promise.reject(text));
        }
        return response.text();
    })
    .then(data => {
        mostrarMensaje(data, 'exito');
        contactForm.reset();
    })
    .catch(error => {
        mostrarMensaje(error || 'Error al conectar con el servidor.', 'error');
    });
}
*/

// ==========================================
// 7. EFECTOS ADICIONALES
// ==========================================

// Cambiar el color del header al hacer scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = '#4a0c56';
    } else {
        header.style.backgroundColor = '#5d0f6b';
    }
});

// Botón volver arriba (opcional)
const scrollToTop = document.createElement('button');
scrollToTop.innerHTML = '↑';
scrollToTop.className = 'scroll-to-top';
scrollToTop.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background-color: #ff5722;
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    display: none;
    z-index: 999;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
`;

document.body.appendChild(scrollToTop);

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        scrollToTop.style.display = 'block';
    } else {
        scrollToTop.style.display = 'none';
    }
});

scrollToTop.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollToTop.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
    this.style.backgroundColor = '#e64a19';
});

scrollToTop.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.backgroundColor = '#ff5722';
});

console.log('🎨 Multi Digital - Website cargado correctamente');