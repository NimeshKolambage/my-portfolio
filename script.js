
// Hamburger Menu Toggle
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (!hamburger || !navbar) return;
    
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navbar.classList.toggle('active');
    });
    
    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navbar.classList.remove('active');
        });
    });
    
    // Close menu when window is resized to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navbar.classList.remove('active');
        }
    });
}

function initIntroAnimation() {
    const lettersContainer = document.getElementById('lettersContainer');
    const introSection = document.getElementById('intro');
    const nameWrapper = document.querySelector('.name-wrapper');
    const headerLogo = document.querySelector('.logo');
    
    if (!lettersContainer) return;

   
    setTimeout(() => {
        const letters = lettersContainer.querySelectorAll('.letter');
        const textSequence = ['N', 'I', 'V', 'I'];
        
       
        letters.forEach((letter, index) => {
            if (index < textSequence.length) {
                letter.textContent = textSequence[index];
            } else {
                letter.style.display = 'none';
            }
        });
    }, 3000);

    // Animate NIVI text moving to logo position
    setTimeout(() => {
        if (nameWrapper && headerLogo) {
            const headerRect = headerLogo.getBoundingClientRect();
            const currentRect = nameWrapper.getBoundingClientRect();
            
            const translateX = (headerRect.left + headerRect.width / 2) - (currentRect.left + currentRect.width / 2);
            const translateY = (headerRect.top + headerRect.height / 2) - (currentRect.top + currentRect.height / 2);
            
            nameWrapper.style.animation = `moveToLogo 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
            nameWrapper.style.setProperty('--translate-x', `${translateX}px`);
            nameWrapper.style.setProperty('--translate-y', `${translateY}px`);
        }
    }, 4600);
   
    setTimeout(() => {
        introSection.style.pointerEvents = 'none';
    }, 6300);
}


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
            
            currentTextIndex++;
            setTimeout(type, 200);
        } else if (isDeleting && currentTextIndex > 0) {
          
            currentTextIndex--;
            setTimeout(type, 100);
        } else if (!isDeleting && currentTextIndex === currentRole.length) {
            
            setTimeout(() => {
                isDeleting = true;
                type();
            }, 2000);
        } else if (isDeleting && currentTextIndex === 0) {
            
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            setTimeout(type, 500);
        }
    }

    type();
}

emailjs.init("xybJ_i1qV33sbYDA7");

// ===== PROJECT SLIDER FUNCTIONALITY =====
function initProjectSlider() {
    const slider = document.getElementById('projectsSlider');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    
    if (!slider || !prevBtn || !nextBtn) {
        console.error('Slider or buttons not found');
        return;
    }

    const originalCards = Array.from(slider.querySelectorAll('.project-card'));
    const totalCards = originalCards.length;
    let cardsPerView = 3;
    let currentIndex = 0;
    let isMarqueeMode = true;

    console.log('Slider initialized with ' + totalCards + ' cards');

    // Clone cards for seamless marquee loop
    function setupMarqueeCards() {
        const existingClones = slider.querySelectorAll('.project-card[data-clone]');
        existingClones.forEach(clone => clone.remove());
        
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('data-clone', 'true');
            slider.appendChild(clone);
        });
    }

    // Update cards per view based on screen size
    function updateCardsPerView() {
        const width = window.innerWidth;
        if (width <= 768) {
            cardsPerView = 1;
        } else if (width <= 1024) {
            cardsPerView = 2;
        } else {
            cardsPerView = 3;
        }
    }

    // Get max index for manual mode
    function getMaxIndex() {
        const totalGroups = Math.ceil(totalCards / cardsPerView);
        return Math.max(0, totalGroups - 1);
    }

    // Update slider position for manual mode
    function updateSlider() {
        const offset = -currentIndex * 100;
        slider.style.transform = `translateX(${offset}%)`;
    }

    // Initialize marquee - runs automatically and continuously
    function initMarquee() {
        setupMarqueeCards();
        slider.classList.add('marquee-active');
        slider.classList.remove('marquee-paused');
        prevBtn.classList.add('marquee-mode');
        nextBtn.classList.add('marquee-mode');
        isMarqueeMode = true;
        console.log('Marquee mode started');
    }

    // Stop marquee and switch to manual mode
    function stopMarqueeAndOptions() {
        console.log('Stopping marquee, switching to manual mode');
        isMarqueeMode = false;
        
        // Remove animation and cloned cards
        slider.classList.remove('marquee-active');
        slider.classList.remove('marquee-paused');
        slider.style.animation = 'none';
        
        const clonedCards = slider.querySelectorAll('.project-card[data-clone]');
        clonedCards.forEach(clone => clone.remove());

        // Reset to first group
        currentIndex = 0;
        updateCardsPerView();
        slider.style.transform = 'translateX(0)';
        slider.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Enable arrow buttons by removing marquee-mode class
        prevBtn.classList.remove('marquee-mode');
        nextBtn.classList.remove('marquee-mode');
    }

    // Manual navigation - next
    function nextSlide() {
        console.log('Next slide clicked, currentIndex: ' + currentIndex + ', maxIndex: ' + getMaxIndex());
        if (currentIndex < getMaxIndex()) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop to beginning
        }
        updateSlider();
    }

    // Manual navigation - previous
    function prevSlide() {
        console.log('Prev slide clicked, currentIndex: ' + currentIndex);
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = getMaxIndex(); // Loop to end
        }
        updateSlider();
    }

    // Pause on hover (only in marquee mode)
    function pauseMarquee() {
        if (isMarqueeMode) {
            slider.classList.add('marquee-paused');
        }
    }

    // Resume after hover (only in marquee mode)
    function resumeMarquee() {
        if (isMarqueeMode) {
            slider.classList.remove('marquee-paused');
        }
    }

    // Arrow button click handlers - MOST IMPORTANT
    nextBtn.addEventListener('click', function(e) {
        console.log('Next button clicked! isMarqueeMode:', isMarqueeMode);
        e.preventDefault();
        e.stopPropagation();
        
        if (isMarqueeMode) {
            stopMarqueeAndOptions();
        }
        nextSlide();
    });

    prevBtn.addEventListener('click', function(e) {
        console.log('Prev button clicked! isMarqueeMode:', isMarqueeMode);
        e.preventDefault();
        e.stopPropagation();
        
        if (isMarqueeMode) {
            stopMarqueeAndOptions();
        }
        prevSlide();
    });

    // Add hover listeners to slider (pause/resume)
    slider.addEventListener('mouseenter', pauseMarquee);
    slider.addEventListener('mouseleave', resumeMarquee);

    // Window resize handler
    window.addEventListener('resize', () => {
        if (!isMarqueeMode) {
            updateCardsPerView();
            if (currentIndex > getMaxIndex()) {
                currentIndex = getMaxIndex();
            }
            updateSlider();
        }
    });

    // Initialize marquee on load
    initMarquee();
}

document.addEventListener('DOMContentLoaded', () => {
initHamburgerMenu();
initIntroAnimation(); 
initCyclingTyping(); 
initProjectSlider(); 
initScrollAnimations(); 

// Navbar active link management with scroll detection
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

function updateActiveNavLink() {
    let currentSection = '';
    
    // Check which section is in viewport
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop - 150) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Update active link based on current section
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Get the href value
        const href = link.getAttribute('href');
        
        // Match the link with current section
        if (href === '#' && window.scrollY < 150) {
            link.classList.add('active');
        } else if (href.substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
}

// Update on scroll
window.addEventListener('scroll', updateActiveNavLink);

// ===== SCROLL ANIMATION FUNCTIONALITY =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll(
        '.section-title, .about-wrapper, .info-card, .skill-item, .service-item'
    );
    
    animateElements.forEach(element => {
        element.classList.add('scroll-animate');
        observer.observe(element);
    });
}

// Click handler for manual navigation
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const href = this.getAttribute('href');
        
        // Handle home link
        if (href === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Scroll to section
            const targetSection = document.querySelector(href);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Update active link immediately
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

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
        
      
        btn.classList.add("loading");
        btn.disabled = true;

       
        emailjs.sendForm('service_oe9nicr', 'template_zhbpxrv', this)
            .then(() => {
               
                btn.classList.remove("loading");
                btnText.innerText = "Message Sent!";
                
               
                hireModal.classList.remove("active");
                document.body.style.overflow = "auto";
                
                
                successModal.classList.add("show");
                
               
                contactForm.reset();
                
             
                setTimeout(() => {
                    successModal.classList.remove("show");
                    btnText.innerText = originalText;
                    btn.disabled = false;
                }, 3000);
            }, (error) => {
                btn.classList.remove("loading");
                btnText.innerText = "Error!";
                btn.disabled = false;
                
              
                setTimeout(() => {
                    btnText.innerText = originalText;
                }, 2000);
            });
    });
}
});


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

if (lettersBox && line && wrapper && overlay) {
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
}


function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    
    
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }


    tablinks = document.getElementsByClassName("resume-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

   
    const activeTab = document.getElementById(tabName);
    activeTab.style.display = "block";
    activeTab.classList.add("active");
    evt.currentTarget.classList.add("active");
}

/* ===== AI CHATBOT FUNCTIONALITY ===== */

const chatbotResponses = {
    greeting: [
        "Hello! How can I assist you today? 😊",
        "Hi there! What can I help you with?",
        "Hey! Feel free to ask me anything about Nimesh."
    ],
    services: [
        "Nimesh offers the following services:\n\n✨ Website Development - Building responsive and modern web applications\n✨ App Development - Creating functional mobile and desktop applications\n✨ Website Hosting - Professional hosting solutions\n✨ UI/UX Design - Crafting beautiful user experiences\n\nWhich service interests you?"
    ],
    skills: [
        "Nimesh is skilled in:\n\n💻 Frontend: HTML5, CSS3, JavaScript\n🎨 Frameworks: React, UI/UX Design\n🔧 Backend: JavaScript, Java, Node.js\n🔌 Other: Firebase, REST APIs\n\nWould you like to know more about any specific skill?"
    ],
    hire: [
        "Great! You can hire Nimesh by:\n\n📧 Email: nimeshkolambage@gmail.com\n💼 LinkedIn: linkedin.com/in/nimesh-kolambage\n📱 GitHub: github.com/NimeshKolambage\n 🔗 Visit the 'Hire me' button at the top of the page\n\nI can also help you schedule a meeting or answer any questions about rates and availability."
    ],
    projects: [
        "Nimesh has worked on various projects including:\n\n🎯 Web Applications - Building interactive user interfaces\n📱 Mobile Solutions - Cross-platform applications\n🎨 Design Projects - Beautiful UI/UX implementations\n\nYou can check out all projects in the Work section of the portfolio!"
    ],
    experience: [
        "Nimesh currently:\n\n🎓 Studying BSc (Hons) in Software Engineering at NIBM (2023-Present)\n📚 Previously completed Diploma in IT at NIBM (2021-2022)\n\nHe combines academic knowledge with practical experience to deliver exceptional results."
    ],
    default: [
        "That's an interesting question! I'm here primarily to help with information about Nimesh Kolambage's services, skills, and portfolio. Feel free to ask about:\n\n• Services I offer\n• Technical skills\n• How to hire\n• Projects & experience\n\nOr ask anything else and I'll try my best to help! 😊"
    ]
};

function initChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWidget = document.getElementById('chatbot-widget');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');

    if (!chatbotToggle || !chatbotWidget) return;

    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', () => {
        chatbotWidget.classList.toggle('active');
        chatbotToggle.classList.toggle('active');
        
        // Handle body scroll on mobile
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            if (chatbotWidget.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                chatbotInput.focus();
            } else {
                document.body.style.overflow = 'auto';
            }
        }
        
        if (chatbotWidget.classList.contains('active')) {
            chatbotInput.focus();
            document.getElementById('unread-badge').style.display = 'none';
        }
    });

    // Close chatbot
    chatbotClose.addEventListener('click', () => {
        chatbotWidget.classList.remove('active');
        chatbotToggle.classList.remove('active');
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'auto';
        }
    });

    // Send message on button click
    chatbotSend.addEventListener('click', sendChatMessage);

    // Listen for Enter key
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            sendChatMessage();
        }
    });

    // Handle window resize to adjust overflow
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && chatbotWidget.classList.contains('active')) {
            document.body.style.overflow = 'auto';
        }
    });
}

function sendChatMessage() {
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const userMessage = chatbotInput.value.trim();

    if (!userMessage) return;

    // Add user message to chat
    addMessage(userMessage, 'user');
    chatbotInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Get bot response
    setTimeout(() => {
        removeTypingIndicator();
        const botResponse = getBotResponse(userMessage);
        addMessage(botResponse, 'bot');
    }, 800 + Math.random() * 1200);

    // Auto-scroll to bottom
    setTimeout(() => {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }, 100);
}

function handleChatSubmit(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChatMessage();
    }
}

function sendQuickReply(message) {
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotWidget = document.getElementById('chatbot-widget');
    
    if (!chatbotWidget.classList.contains('active')) {
        document.getElementById('chatbot-toggle').click();
    }
    
    chatbotInput.value = message;
    setTimeout(() => sendChatMessage(), 200);
}

function addMessage(text, sender) {
    const chatbotMessages = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = text;

    messageDiv.appendChild(messageContent);
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function showTypingIndicator() {
    const chatbotMessages = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typing-indicator';
    
    const content = document.createElement('div');
    content.className = 'message-content typing-indicator';
    content.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    
    typingDiv.appendChild(content);
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) typingIndicator.remove();
}

function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();

    // Check for keywords and return appropriate response
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return getRandomResponse(chatbotResponses.greeting);
    }
    
    if (message.includes('service') || message.includes('offer') || message.includes('what do you do')) {
        return getRandomResponse(chatbotResponses.services);
    }
    
    if (message.includes('skill') || message.includes('expertise') || message.includes('language') || message.includes('technology') || message.includes('tech')) {
        return getRandomResponse(chatbotResponses.skills);
    }
    
    if (message.includes('hire') || message.includes('contact') || message.includes('email') || message.includes('work with') || message.includes('collaborate')) {
        return getRandomResponse(chatbotResponses.hire);
    }
    
    if (message.includes('project') || message.includes('portfolio') || message.includes('work')) {
        return getRandomResponse(chatbotResponses.projects);
    }
    
    if (message.includes('experience') || message.includes('background') || message.includes('education') || message.includes('cv') || message.includes('resume')) {
        return getRandomResponse(chatbotResponses.experience);
    }

    if (message.includes('thank') || message.includes('thanks') || message.includes('thanks!')) {
        return "You're welcome! Is there anything else I can help you with? 😊";
    }

    if (message.includes('about') || message.includes('who') || message.includes('nimesh')) {
        return "I'm here to help you learn about Nimesh Kolambage's services and portfolio. Nimesh is a passionate Software Developer and UI/UX enthusiast with expertise in web and app development. Ask me about his services, skills, projects, or how to hire him!";
    }

    return getRandomResponse(chatbotResponses.default);
}

function getRandomResponse(responseArray) {
    return responseArray[Math.floor(Math.random() * responseArray.length)];
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}
