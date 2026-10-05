/* ========================================
   R&R SoftTech - Interactive Scripts
   ======================================== */

// Ruta de este script (sirve para localizar sw.js tanto en / como en /en/)
const SCRIPT_URL = document.currentScript ? document.currentScript.src : '';

// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80
});

// ========== Particles Background ==========
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = { x: null, y: null, radius: 120 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
    resizeCanvas();
    // En móvil la barra de direcciones cambia la altura al hacer scroll: solo regenerar si cambia el ancho
    if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        initParticles();
    }
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = this.getColor();
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    getColor() {
        const colors = [
            '124, 58, 237',   // purple
            '6, 182, 212',    // cyan
            '236, 72, 153',   // pink
            '167, 139, 250'   // light purple
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Mouse interaction
        if (mouse.x !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                this.x -= dx * force * 0.02;
                this.y -= dy * force * 0.02;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    // Más estrellas: 1 por cada 5.000 px² (antes 12.000), con tope de 260 (antes 100)
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 5000), 260);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const opacity = (1 - dist / 120) * 0.15;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Mouse tracking for particles & cursor glow
const cursorGlow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    if (cursorGlow) {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    }
});

document.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// ========== Navbar ==========
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active nav link
    updateActiveNav();
});

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 150;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        
        if (link) {
            if (scrollY >= top && scrollY < top + height) {
                navLinkItems.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

// ========== Counter Animation ==========
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };
        
        update();
    });
}

// Trigger counters when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    heroObserver.observe(heroStats);
}

// ========== Back to Top ==========
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== Contact Form ==========
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value;
        
        // Build WhatsApp message
        const serviceNames = {
            software: 'Desarrollo de Software',
            mobile: 'Apps Móviles',
            design: 'Diseño & Branding',
            marketing: 'Marketing Digital',
            social: 'Redes Sociales',
            consulting: 'Consultoría IT',
            other: 'Otro'
        };
        
        let text = `Hola R&R SoftTech! 👋\n\n`;
        text += `*Nombre:* ${name}\n`;
        text += `*Email:* ${email}\n`;
        if (phone) text += `*Teléfono:* ${phone}\n`;
        text += `*Servicio:* ${serviceNames[service] || service}\n\n`;
        text += `*Mensaje:*\n${message}`;
        
        const whatsappUrl = `https://wa.me/5356729186?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
        
        // Reset form
        contactForm.reset();
        
        // Show feedback
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> <span>¡Redirigiendo a WhatsApp!</span>';
        btn.style.background = 'linear-gradient(135deg, #25d366, #128c7e)';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
        }, 3000);
    });
}

// ========== Smooth reveal for service cards on hover ==========
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const glow = this.querySelector('.card-glow');
        if (glow) {
            glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(124, 58, 237, 0.15) 0%, transparent 50%)`;
        }
    });
});

// ========== Parallax effect for orbs ==========
document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    
    orbs.forEach((orb, i) => {
        const factor = (i + 1) * 0.5;
        orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
});

console.log('%c🚀 R&R SoftTech', 'font-size: 24px; font-weight: bold; color: #7c3aed;');
console.log('%cEl nexo entre tu idea y la excelencia digital.', 'font-size: 12px; color: #94a3b8;');


// ========== Descargar / instalar aplicación (PWA) ==========
(function () {
    const installBtn = document.getElementById('install-btn');
    const isEN = document.documentElement.lang === 'en';
    let deferredPrompt = null;

    // Service worker (necesario para que el navegador ofrezca instalar la app). Requiere https o localhost.
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && SCRIPT_URL) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register(new URL('../sw.js', SCRIPT_URL).href)
                .catch((err) => console.warn('SW no registrado:', err));
        });
    }

    if (!installBtn) return;

    const isStandalone = () =>
        window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

    if (isStandalone()) {
        installBtn.hidden = true;
        return;
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();          // guardamos el aviso para lanzarlo desde nuestro botón
        deferredPrompt = e;
    });

    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        installBtn.hidden = true;
    });

    const ua = navigator.userAgent || '';
    const isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /android/i.test(ua);

    const T = isEN ? {
        title: 'Download the app',
        intro: 'Install R&R SoftTech on your device to open it like any other app.',
        ios: ['Tap the <strong>Share</strong> button in Safari.', 'Choose <strong>Add to Home Screen</strong>.', 'Tap <strong>Add</strong>.'],
        android: ['Open the browser menu <strong>(⋮)</strong>.', 'Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.', 'Confirm with <strong>Install</strong>.'],
        desktop: ['Look for the <strong>install icon</strong> at the right of the address bar (Chrome / Edge).', 'Click <strong>Install</strong>.'],
        close: 'Close'
    } : {
        title: 'Descargar la aplicación',
        intro: 'Instala R&R SoftTech en tu dispositivo para abrirla como cualquier otra app.',
        ios: ['Pulsa el botón <strong>Compartir</strong> de Safari.', 'Elige <strong>Añadir a pantalla de inicio</strong>.', 'Pulsa <strong>Añadir</strong>.'],
        android: ['Abre el menú del navegador <strong>(⋮)</strong>.', 'Pulsa <strong>Instalar aplicación</strong> o <strong>Añadir a pantalla de inicio</strong>.', 'Confirma con <strong>Instalar</strong>.'],
        desktop: ['Busca el <strong>icono de instalar</strong> a la derecha de la barra de direcciones (Chrome / Edge).', 'Haz clic en <strong>Instalar</strong>.'],
        close: 'Cerrar'
    };

    function openHelp() {
        const steps = isIOS ? T.ios : isAndroid ? T.android : T.desktop;
        let dlg = document.getElementById('install-dialog');
        if (!dlg) {
            dlg = document.createElement('dialog');
            dlg.id = 'install-dialog';
            dlg.className = 'install-dialog';
            dlg.setAttribute('aria-labelledby', 'install-dialog-title');
            document.body.appendChild(dlg);
            dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
        }
        dlg.innerHTML =
            '<h3 id="install-dialog-title">' + T.title + '</h3>' +
            '<p>' + T.intro + '</p>' +
            '<ol>' + steps.map((s) => '<li>' + s + '</li>').join('') + '</ol>' +
            '<button type="button" class="btn btn-primary" id="install-dialog-close"><span>' + T.close + '</span></button>';
        dlg.querySelector('#install-dialog-close').addEventListener('click', () => dlg.close());
        if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    }

    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            try { await deferredPrompt.userChoice; } catch (_) {}
            deferredPrompt = null;
        } else {
            openHelp();   // iOS / navegadores sin instalación directa / ya instalada / abierto como archivo local
        }
    });
})();
