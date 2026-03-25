// ==========================================
// MULTI DIGITAL - JAVASCRIPT
// ==========================================

// ── 1. MENÚ RESPONSIVE ──
const menuToggle = document.querySelector('.menu-toggle');
const navMenu    = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
    const toggleMenu = (open) => {
        navMenu.classList.toggle('active', open);
        const spans = menuToggle.querySelectorAll('span');
        const isOpen = open !== undefined ? open : navMenu.classList.contains('active');
        
        spans[0].style.transform = isOpen ? 'rotate(45deg) translateY(8px)' : 'none';
        spans[1].style.opacity   = isOpen ? '0' : '1';
        spans[2].style.transform = isOpen ? 'rotate(-45deg) translateY(-8px)' : 'none';
    };

    menuToggle.addEventListener('click', () => toggleMenu());

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });
}

// ── 2. SCROLL SUAVE ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const targetId = a.getAttribute('href');
        if (targetId === "#") return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── 3. PASOS CLICKEABLES (expandir info) ──
document.querySelectorAll('.paso').forEach(paso => {
    paso.addEventListener('click', () => {
        const yaAbierto = paso.classList.contains('abierto');
        // Cerrar todos los demás para efecto acordeón
        document.querySelectorAll('.paso').forEach(p => p.classList.remove('abierto'));
        // Abrir el clickeado si no estaba abierto
        if (!yaAbierto) paso.classList.add('abierto');
    });
});

// ── 4. BOTONES CONSULTAR → pre-llenan formulario ──
document.querySelectorAll('.btn-consultar').forEach(btn => {
    btn.addEventListener('click', () => {
        const producto = btn.dataset.producto || "un producto";
        const precio   = btn.dataset.precio;
        const contactoSection = document.getElementById('contacto');
        
        if (contactoSection) {
            contactoSection.scrollIntoView({ behavior: 'smooth' });
            
            setTimeout(() => {
                const campo = document.getElementById('mensaje');
                if (campo) {
                    campo.value = precio
                        ? `¡Hola! Me interesa: ${producto} (${precio}). ¿Me podrían dar más información?`
                        : `¡Hola! Me interesa: ${producto}. ¿Me podrían dar más información y el precio?`;
                    campo.focus();
                }
            }, 800);
        }
    });
});

// ── 5. FORMULARIO → envía a enviar.php ──
const contactForm  = document.getElementById('contact-form');
const formMessage  = document.getElementById('form-message');

function mostrarMensaje(texto, tipo) {
    if (!formMessage) return;
    
    formMessage.textContent = texto;
    const estilos = {
        exito:    { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
        error:    { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
        cargando: { bg: '#fff3cd', color: '#856404', border: '#ffc107' }
    };
    
    const e = estilos[tipo] || estilos.error;
    formMessage.style.cssText = `
        display: block; 
        margin-top: 16px; 
        padding: 14px;
        border-radius: 10px; 
        font-weight: 700;
        background: ${e.bg}; 
        color: ${e.color}; 
        border: 1px solid ${e.border};
    `;
    
    if (tipo !== 'cargando') {
        setTimeout(() => { 
            formMessage.style.display = 'none'; 
        }, 6000);
    }
}

if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const nombre  = document.getElementById('nombre').value.trim();
        const email   = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        if (!nombre || !email || !mensaje) {
            mostrarMensaje('Por favor completá todos los campos.', 'error'); 
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            mostrarMensaje('Ingresá un email válido.', 'error'); 
            return;
        }

        const btnEnviar = contactForm.querySelector('button[type="submit"]');
        btnEnviar.disabled = true;
        const textoOriginal = btnEnviar.textContent;
        btnEnviar.textContent = 'Enviando...';
        mostrarMensaje('Enviando mensaje...', 'cargando');

        // ⚠️ FORMSPREE: reemplazá la URL con tu endpoint real de formspree.io
        // Pasos: 1) Entrá a https://formspree.io  2) Creá una cuenta gratis
        // 3) Creá un nuevo formulario  4) Copiá tu URL (ej: https://formspree.io/f/xxxxxxxx)
        const FORMSPREE_URL = 'https://formspree.io/f/TU_ID_AQUI';

        const formData = new FormData(contactForm);

        fetch(FORMSPREE_URL, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
            .then(r => r.ok ? r.json() : r.json().then(data => Promise.reject(data)))
            .then(() => {
                mostrarMensaje('✅ ¡Mensaje enviado! Te respondemos pronto 💜', 'exito');
                contactForm.reset();
            })
            .catch(() => {
                mostrarMensaje('❌ Error al enviar. Escribinos por WhatsApp.', 'error');
            })
            .finally(() => {
                btnEnviar.disabled = false;
                btnEnviar.textContent = textoOriginal;
            });
    });
}

// ── 6. ANIMACIONES Y BORDES DINÁMICOS ACTUALIZADO ──

const appearanceObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

// Ajustamos este observador para que sea más sensible a tarjetas en fila
const borderObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        // Si la tarjeta está visible al 50%, se enciende. Si no, se apaga.
        if (entry.isIntersecting) {
            entry.target.classList.add('card-enfocada');
        } else {
            entry.target.classList.remove('card-enfocada');
        }
    });
}, { 
    threshold: 0.5, // Bajamos a 0.5 para que detecte mejor las tarjetas pequeñas
    rootMargin: '0px -10% 0px -10%' // Margen lateral para evitar que se activen todas a la vez
});

document.querySelectorAll('.producto-card, .paso, .testimonio-card').forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${(i % 3) * 0.1}s`; 
    appearanceObserver.observe(el);

    // Aplicar a productos y reseñas
    if (el.classList.contains('producto-card') || el.classList.contains('testimonio-card')) {
        borderObserver.observe(el);
    }
});

// ── 7. HEADER: sombra dinámica al hacer scroll ──
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        header.style.boxShadow = window.scrollY > 50 
            ? '0 4px 30px rgba(0,0,0,0.12)' 
            : '0 2px 20px rgba(0,0,0,0.08)';
    }
});

console.log('🎨 Multi Digital: JavaScript activo ✓');

// ── 8. AÑO DINÁMICO EN EL FOOTER ──
const anioEl = document.getElementById('anio');
if (anioEl) anioEl.textContent = new Date().getFullYear();