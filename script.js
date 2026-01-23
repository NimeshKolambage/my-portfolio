// Cycling typing animation for roles
function initCyclingTyping() {
    const roleSpan = document.querySelector('.role');
    if (!roleSpan) return;

    const roles = ['Software Developer</>', 'UI/UX Developer</>'];
    let currentRoleIndex = 0;
    let currentTextIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[currentRoleIndex];
        const displayText = currentRole.substring(0, currentTextIndex);

        roleSpan.textContent = displayText;

        if (!isDeleting && currentTextIndex < currentRole.length) {
            // Typing phase
            currentTextIndex++;
            setTimeout(type, 200);
        } else if (isDeleting && currentTextIndex > 0) {
            // Deleting phase
            currentTextIndex--;
            setTimeout(type, 100);
        } else if (!isDeleting && currentTextIndex === currentRole.length) {
            // Wait before deleting
            setTimeout(() => {
                isDeleting = true;
                type();
            }, 2000);
        } else if (isDeleting && currentTextIndex === 0) {
            // Move to next role
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            setTimeout(type, 500);
        }
    }

    type();
}

emailjs.init("xybJ_i1qV33sbYDA7");
document.addEventListener('DOMContentLoaded', () => {
initCyclingTyping(); // Typing animation එක

// CV Download Button Animation
const cvDownloadBtn = document.querySelector('.cv-download');
if (cvDownloadBtn) {
    cvDownloadBtn.addEventListener('click', function(e) {
        // Add downloading class to trigger animation
        this.classList.add('downloading');
        
        // Remove animation class after it completes
        setTimeout(() => {
            this.classList.remove('downloading');
        }, 2000);
    });
}

const hireModal = document.getElementById("hire-modal");
const hireBtn = document.querySelector(".hire-btn");
const closeBtn = document.querySelector(".close-btn");
const contactForm = document.getElementById("contact-form");
const successModal = document.getElementById('success-modal');

// Input validation function
function validateField(field) {
    const formGroup = field.closest('.form-group');
    const errorMsg = formGroup.querySelector('.error-message');
    let isValid = true;
    let message = '';

    if (field.hasAttribute('required') && field.value.trim() === '') {
        isValid = false;
        message = 'This field is required';
    } else if (field.type === 'email' && field.value.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            message = 'Please enter a valid email';
        }
    }
    

    if (!isValid) {
        field.classList.add('error');
        if (errorMsg) {
            errorMsg.textContent = message;
            errorMsg.classList.add('show');
        }
    } else {
        field.classList.remove('error');
        if (errorMsg) {
            errorMsg.classList.remove('show');
        }
    }

    return isValid;
}

// Validate all required fields
function validateForm() {
    const requiredFields = contactForm.querySelectorAll('[required]');
    let isFormValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });

    return isFormValid;
}

// Add blur and focus event listeners to inputs
const formFields = contactForm.querySelectorAll('input, select, textarea');
formFields.forEach(field => {
    field.addEventListener('blur', function() {
        validateField(this);
    });

    field.addEventListener('focus', function() {
        const formGroup = this.closest('.form-group');
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.classList.remove('show');
        }
        this.classList.remove('error');
    });
});

// --- Hire Me Modal Control ---
if (hireBtn) {
    hireBtn.addEventListener("click", (e) => {
        e.preventDefault();
        hireModal.classList.add("active");
        document.body.style.overflow = "hidden";
    });
}

if (closeBtn) {
    closeBtn.onclick = () => {
        hireModal.classList.remove("active");
        document.body.style.overflow = "auto";
    };
}

// --- EmailJS හරහා Form එක Submit කිරීම ---
if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        const btn = this.querySelector(".send-btn");
        const btnText = btn.querySelector(".btn-text");
        const originalText = btnText.innerText;
        
        // Show loading state
        btn.classList.add("loading");
        btn.disabled = true;

        // EmailJS Service ID, Template ID
        emailjs.sendForm('service_oe9nicr', 'template_zhbpxrv', this)
            .then(() => {
                // Hide loading state
                btn.classList.remove("loading");
                btnText.innerText = "Message Sent!";
                
                // First, close the hire modal
                hireModal.classList.remove("active");
                document.body.style.overflow = "auto";
                
                // Then show success modal
                successModal.classList.add("show");
                
                // Reset form
                contactForm.reset();
                
                // Hide success modal and reset button after 3 seconds
                setTimeout(() => {
                    successModal.classList.remove("show");
                    btnText.innerText = originalText;
                    btn.disabled = false;
                }, 3000);
            }, (error) => {
                btn.classList.remove("loading");
                btnText.innerText = "Error!";
                btn.disabled = false;
                
                // Show error message
                setTimeout(() => {
                    btnText.innerText = originalText;
                }, 2000);
            });
    });
}
});

// Canvas setup for atoms animation
const canvas = document.getElementById('atoms-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const connections = [];
let particleCount = 80;
let mouse = { x: null, y: null, radius: 100 };
let speed = 1;
let showConnections = true;
let showParticles = false;

const colors = [
    '#6c63ff', '#ff6b9d', '#4dccff', '#6bffb8', '#ffcc4d'
];

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.baseSize = this.size;
        this.speedX = (Math.random() - 0.5) * speed;
        this.speedY = (Math.random() - 0.5) * speed;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.pulseSpeed = Math.random() * 0.05 + 0.02;
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.orbitRadius = Math.random() * 20 + 5;
        this.orbitSpeed = Math.random() * 0.01 + 0.005;
        this.orbitAngle = Math.random() * Math.PI * 2;
        this.centerX = this.x;
        this.centerY = this.y;
    }
    
    update() {
        this.orbitAngle += this.orbitSpeed;
        this.x = this.centerX + Math.cos(this.orbitAngle) * this.orbitRadius;
        this.y = this.centerY + Math.sin(this.orbitAngle) * this.orbitRadius;
        
        this.centerX += this.speedX * 0.3;
        this.centerY += this.speedY * 0.3;
        
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
        
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const angle = Math.atan2(dy, dx);
                const force = (mouse.radius - distance) / mouse.radius;
                this.x -= Math.cos(angle) * force * 5;
                this.y -= Math.sin(angle) * force * 5;
            }
        }
        
        const pulse = Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset) * 0.3 + 0.7;
        this.size = this.baseSize * pulse;
    }
    
    draw() {
        if (!showParticles) return;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.strokeStyle = '#6c63ff';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

function initParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function drawConnections() {
    if (!showConnections) return;
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const opacity = 1 - distance / 100;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(108, 99, 255, ${opacity * 0.3})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.fillStyle = 'rgba(10, 10, 20, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    drawConnections();
    
    requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

initParticles();
animate();


const nameStr = "NIMESH";
const lettersBox = document.getElementById('letters-box');
const line = document.getElementById('line');
const wrapper = document.getElementById('main-wrapper');
const overlay = document.getElementById('intro-overlay');
const content = document.getElementById('site-content');
const typingSpeed = 500; 

nameStr.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.innerText = char;
    span.className = 'letter';
    lettersBox.appendChild(span);

    setTimeout(() => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
        let progress = ((i + 1) / nameStr.length) * 100;
        line.style.width = progress + "%";
    }, i * typingSpeed);
});

setTimeout(() => {
    overlay.style.backgroundColor = "transparent";
    const rect = wrapper.getBoundingClientRect();
    wrapper.style.position = 'fixed';
    wrapper.style.left = rect.left + 'px';
    wrapper.style.top = rect.top + 'px';

    setTimeout(() => {
        wrapper.classList.add('move-to-logo');
        
        setTimeout(() => {
            content.classList.add('show-site');
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 1000);
    }, 100);

}, (nameStr.length * typingSpeed) + 1000);


function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    
    // Hide all contents
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }

    // Deactivate all buttons
    tablinks = document.getElementsByClassName("resume-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // Show current tab
    const activeTab = document.getElementById(tabName);
    activeTab.style.display = "block";
    activeTab.classList.add("active");
    evt.currentTarget.classList.add("active");
}