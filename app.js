// Portfolio JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle - FIXED
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Smooth Scrolling for ALL Navigation Links - FIXED
    function smoothScrollTo(targetId) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // Handle all navigation links including CTA buttons - FIXED
    const allScrollLinks = document.querySelectorAll('a[href^="#"]');
    allScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScrollTo(targetId);
            
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Specific CTA button handlers - FIXED
    const viewWorkBtn = document.getElementById('view-work-btn');
    const getInTouchBtn = document.getElementById('get-in-touch-btn');
    
    if (viewWorkBtn) {
        viewWorkBtn.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScrollTo('#projects');
        });
    }
    
    if (getInTouchBtn) {
        getInTouchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScrollTo('#contact');
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class for styling
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation classes and observe elements
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .achievement-item, .about-text, .contact-content > *');
    animateElements.forEach((element, index) => {
        // Add staggered delay for better effect
        element.style.transitionDelay = `${index * 0.1}s`;
        
        // Add appropriate animation class
        if (element.classList.contains('skill-category') || element.classList.contains('achievement-item')) {
            element.classList.add('fade-in');
        } else if (element.classList.contains('project-card')) {
            element.classList.add('fade-in');
        } else {
            element.classList.add('fade-in');
        }
        
        observer.observe(element);
    });

    // Hero Stats Counter Animation
    const stats = document.querySelectorAll('.stat-value');
    const animateStats = function() {
        stats.forEach(stat => {
            const text = stat.textContent;
            if (text.includes('+')) {
                const number = parseInt(text.replace('+', ''));
                animateCounter(stat, 0, number, '+', 2000);
            }
        });
    };

    function animateCounter(element, start, end, suffix, duration) {
        const range = end - start;
        const increment = range / (duration / 16); // 60 FPS
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    }

    // Trigger stats animation when hero is in view
    const heroObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    // Contact Form Handling - FIXED
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    
    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission with success feedback
            setTimeout(() => {
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification System - ENHANCED
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" type="button">&times;</button>
            </div>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-base);
            padding: var(--space-16);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        
        if (type === 'success') {
            notification.style.borderColor = 'var(--color-success)';
            notification.style.borderLeftWidth = '4px';
            notification.style.borderLeftColor = 'var(--color-success)';
        } else if (type === 'error') {
            notification.style.borderColor = 'var(--color-error)';
            notification.style.borderLeftWidth = '4px';
            notification.style.borderLeftColor = 'var(--color-error)';
        }
        
        document.body.appendChild(notification);
        
        // Close notification
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => notification.remove());
        }
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Add notification animations to CSS
    if (!document.querySelector('#notification-styles')) {
        const notificationStyles = document.createElement('style');
        notificationStyles.id = 'notification-styles';
        notificationStyles.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: var(--space-12);
            }
            
            .notification-message {
                color: var(--color-text);
                font-size: var(--font-size-sm);
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--color-text-secondary);
                font-size: var(--font-size-lg);
                cursor: pointer;
                padding: 0;
                line-height: 1;
                transition: color var(--duration-fast) var(--ease-standard);
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-close:hover {
                color: var(--color-text);
            }
            
            .navbar.scrolled {
                background: rgba(var(--color-slate-900-rgb), 0.98);
                backdrop-filter: blur(20px);
                box-shadow: var(--shadow-md);
            }
        `;
        document.head.appendChild(notificationStyles);
    }

    // Project Cards Hover Effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Skills Cards Interactive Effect
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(skill => {
        skill.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.skill-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'all 0.3s ease';
            }
        });
        
        skill.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.skill-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Active Navigation Link Highlighting - FIXED
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Add active link styles
    if (!document.querySelector('#active-link-styles')) {
        const activeLinkStyles = document.createElement('style');
        activeLinkStyles.id = 'active-link-styles';
        activeLinkStyles.textContent = `
            .nav-menu a.active {
                color: var(--color-primary) !important;
                position: relative;
            }
            
            .nav-menu a.active::after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 0;
                width: 100%;
                height: 2px;
                background: var(--color-primary);
                border-radius: 1px;
            }
            
            @media (max-width: 768px) {
                .nav-menu a.active::after {
                    bottom: 0;
                    height: 100%;
                    width: 3px;
                    left: -12px;
                }
            }
        `;
        document.head.appendChild(activeLinkStyles);
    }

    // Parallax Effect for Hero Section (Optional)
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero && scrolled < window.innerHeight) {
            const rate = scrolled * -0.1; // Reduced for subtlety
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Test functionality on load
    console.log('Portfolio website loaded successfully!');
    console.log('Navigation menu items:', navLinks.length);
    console.log('CTA buttons found:', {
        viewWork: !!viewWorkBtn,
        getInTouch: !!getInTouchBtn
    });
    console.log('Contact form found:', !!contactForm);
    console.log('Mobile toggle found:', !!navToggle);
    
    // Show a brief welcome notification
    setTimeout(() => {
        showNotification('Welcome to my portfolio! Feel free to explore and get in touch.', 'info');
    }, 2000);
});