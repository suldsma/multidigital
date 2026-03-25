// ==========================================
// MULTI DIGITAL - JAVASCRIPT (CORREGIDO)
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

// ── 3. PASOS CLICKEABLES - VER MÁS CORREGIDO ──
document.querySelectorAll('.paso').forEach(paso => {
    const btnVerMas = paso.querySelector('.paso-ver-mas');
    const detalle   = paso.querySelector('.paso-detalle');

    if (btnVerMas && detalle) {
        // Asegurar que el detalle arranca cerrado
        detalle.style.display = 'none';

        btnVerMas.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita conflictos con el click del paso entero
            const estaAbierto = paso.classList.contains('abierto');

            // Cerrar todos los pasos primero (acordeón)
            document.querySelectorAll('.paso').forEach(p => {
                p.classList.remove('abierto');
                const d = p.querySelector('.paso-detalle');
                const b = p.querySelector('.paso-ver-mas');
                if (d) d.style.display = 'none';
                if (b) b.textContent = 'Ver más ▾';
            });

            // Abrir el clickeado si estaba cerrado
            if (!estaAbierto) {
                paso.classList.add('abierto');
                detalle.style.display = 'block';
                btnVerMas.textContent = 'Ver menos ▴';
            }
        });

        // También funciona al hacer click en el paso completo
        paso.addEventListener('click', () => {
            btnVerMas.click();
        });
    }
});

// ── 4. BOTONES CONSULTAR → WHATSAPP (CORREGIDO) ──
document.querySelectorAll('.btn-consultar').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const producto = btn.dataset.producto || "un producto";
        const precio   = btn.dataset.precio;

        const texto = precio
            ? `¡Hola! Me interesa: *${producto}* (${precio}). ¿Me podrían dar más información?`
            : `¡Hola! Me interesa: *${producto}*. ¿Me podrían dar más información y el precio?`;

        const url = `https://wa.me/543454172380?text=${encodeURIComponent(texto)}`;
        window.open(url, '_blank');
    });
});

// ── 5. FORMULARIO → FORMSPREE ──
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

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
        display: block; margin-top: 16px; padding: 14px;
        border-radius: 10px; font-weight: 700;
        background: ${e.bg}; color: ${e.color}; border: 1px solid ${e.border};
    `;
    if (tipo !== 'cargando') setTimeout(() => { formMessage.style.display = 'none'; }, 6000);
}

if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const nombre  = document.getElementById('nombre').value.trim();
        const email   = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        if (!nombre || !email || !mensaje) { mostrarMensaje('Por favor completá todos los campos.', 'error'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { mostrarMensaje('Ingresá un email válido.', 'error'); return; }

        const btnEnviar = contactForm.querySelector('button[type="submit"]');
        btnEnviar.disabled = true;
        const textoOriginal = btnEnviar.textContent;
        btnEnviar.textContent = 'Enviando...';
        mostrarMensaje('Enviando mensaje...', 'cargando');

        const FORMSPREE_URL = 'https://formspree.io/f/TU_ID_AQUI';
        fetch(FORMSPREE_URL, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
        })
        .then(r => r.ok ? r.json() : r.json().then(data => Promise.reject(data)))
        .then(() => { mostrarMensaje('✅ ¡Mensaje enviado! Te respondemos pronto 💜', 'exito'); contactForm.reset(); })
        .catch(() => { mostrarMensaje('❌ Error al enviar. Escribinos por WhatsApp.', 'error'); })
        .finally(() => { btnEnviar.disabled = false; btnEnviar.textContent = textoOriginal; });
    });
}

// ── 6. ANIMACIONES SCROLL MEJORADAS CON TILT ──

// Fade-up básico para todos los elementos animados
const appearanceObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.producto-card, .paso, .testimonio-card').forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${(i % 3) * 0.12}s`;
    appearanceObserver.observe(el);
});

// Efecto tilt 3D en hover para tarjetas de producto
document.querySelectorAll('.producto-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect  = card.getBoundingClientRect();
        const x     = e.clientX - rect.left;
        const y     = e.clientY - rect.top;
        const cx    = rect.width  / 2;
        const cy    = rect.height / 2;
        const rotX  = ((y - cy) / cy) * -8;
        const rotY  = ((x - cx) / cx) *  8;
        card.style.transform = `translateY(-14px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
        card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease, border-color 0.4s ease';
    });

    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 20px 50px rgba(107,15,122,0.28)';
    });
});

// Efecto tilt suave en testimonios
document.querySelectorAll('.testimonio-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x    = e.clientX - rect.left;
        const y    = e.clientY - rect.top;
        const cx   = rect.width  / 2;
        const cy   = rect.height / 2;
        const rotX = ((y - cy) / cy) * -5;
        const rotY = ((x - cx) / cx) *  5;
        card.style.transform = `translateY(-8px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
    });
});

// Efecto parallax suave en el hero al hacer scroll
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollY = window.scrollY;
        const heroImgWrap = hero.querySelector('.hero-img-wrap');
        if (heroImgWrap && scrollY < 700) {
            heroImgWrap.style.transform = `translateY(${scrollY * 0.12}px)`;
        }
    }

    // Sombra dinámica en header
    const header = document.querySelector('header');
    if (header) {
        header.style.boxShadow = window.scrollY > 50
            ? '0 4px 30px rgba(0,0,0,0.14)'
            : '0 2px 20px rgba(0,0,0,0.08)';
    }
});

// ── 7. AÑO DINÁMICO EN FOOTER ──
const anioEl = document.getElementById('anio');
if (anioEl) anioEl.textContent = new Date().getFullYear();

console.log('🎨 Multi Digital: JavaScript activo ✓');