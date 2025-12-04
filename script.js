/**
 * BARBEARIA LENHADOR - JavaScript
 * Handles navigation, animations, and interactivity
 */

(function() {
    'use strict';

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('theme-toggle');

    // ============================================
    // THEME TOGGLE (Dark/Light Mode)
    // ============================================
    
    const THEME_KEY = 'barbearia-lenhador-theme';
    
    /**
     * Gets the saved theme from localStorage or system preference
     */
    function getSavedTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme) {
            return savedTheme;
        }
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        return 'dark';
    }
    
    /**
     * Applies the theme to the document
     */
    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
        localStorage.setItem(THEME_KEY, theme);
    }
    
    /**
     * Toggles between dark and light themes
     */
    function toggleTheme() {
        const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    }
    
    // Initialize theme on page load
    applyTheme(getSavedTheme());
    
    // Theme toggle click handler
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
            if (!localStorage.getItem(THEME_KEY)) {
                applyTheme(e.matches ? 'light' : 'dark');
            }
        });
    }

    // ============================================
    // MOBILE NAVIGATION
    // ============================================
    
    /**
     * Opens the mobile navigation menu
     */
    function openMenu() {
        navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Closes the mobile navigation menu
     */
    function closeMenu() {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Toggle menu on hamburger click
    if (navToggle) {
        navToggle.addEventListener('click', openMenu);
    }

    // Close menu on X button click
    if (navClose) {
        navClose.addEventListener('click', closeMenu);
    }

    // Close menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // ============================================
    // HEADER SCROLL BEHAVIOR
    // ============================================
    
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;

        // Add shadow when scrolled
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // ============================================
    // ACTIVE NAVIGATION LINK
    // ============================================
    
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // ============================================
    // SCROLL REVEAL ANIMATION
    // ============================================
    
    function initScrollReveal() {
        // Add reveal class to elements
        const revealElements = [
            '.about-card',
            '.hours-card',
            '.certificate-frame',
            '.map-wrapper',
            '.contact-card',
            '.contact-link'
        ];

        revealElements.forEach((selector, index) => {
            document.querySelectorAll(selector).forEach((el, i) => {
                el.classList.add('reveal');
                // Add staggered delay for multiple items
                if (i < 3) {
                    el.classList.add(`reveal-delay-${i + 1}`);
                }
            });
        });
    }

    function handleScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    }

    // Initialize reveal elements
    initScrollReveal();
    
    // Check on scroll
    window.addEventListener('scroll', handleScrollReveal);
    
    // Check on load
    handleScrollReveal();

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // OPEN/CLOSE STATUS INDICATOR
    // ============================================
    
    function updateOpenStatus() {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = hour * 60 + minute; // Convert to minutes

        // Schedule: 
        // Monday (1): Closed
        // Tuesday-Friday (2-5): 09:00-19:00 (except Thursday 09:00-17:00)
        // Saturday (6): 09:00-17:00
        // Sunday (0): Closed

        const schedule = {
            0: null, // Sunday - closed
            1: null, // Monday - closed
            2: { open: 9 * 60, close: 19 * 60 }, // Tuesday
            3: { open: 9 * 60, close: 19 * 60 }, // Wednesday
            4: { open: 9 * 60, close: 17 * 60 }, // Thursday
            5: { open: 9 * 60, close: 19 * 60 }, // Friday
            6: { open: 9 * 60, close: 17 * 60 }  // Saturday
        };

        const todaySchedule = schedule[day];
        let isOpen = false;

        if (todaySchedule) {
            isOpen = currentTime >= todaySchedule.open && currentTime < todaySchedule.close;
        }

        // Update UI if there's a status indicator
        const statusIndicator = document.querySelector('.status-indicator');
        if (statusIndicator) {
            statusIndicator.classList.toggle('open', isOpen);
            statusIndicator.classList.toggle('closed', !isOpen);
            statusIndicator.textContent = isOpen ? 'Aberto agora' : 'Fechado';
        }

        // Highlight today's hours in the schedule
        const hoursItems = document.querySelectorAll('.hours-item');
        const dayMapping = [6, 0, 1, 2, 3, 4, 5]; // Map JS day to list index (Sunday=6)
        const todayIndex = dayMapping[day];

        hoursItems.forEach((item, index) => {
            item.classList.remove('today');
            if (index === todayIndex) {
                item.classList.add('today');
            }
        });
    }

    // Update status on load
    updateOpenStatus();
    
    // Update every minute
    setInterval(updateOpenStatus, 60000);

    // ============================================
    // LAZY LOAD IMAGES (if any are added later)
    // ============================================
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // ANALYTICS HELPER (placeholder for future)
    // ============================================
    
    function trackEvent(category, action, label) {
        // Placeholder for analytics tracking
        // Can be connected to Google Analytics or other services
        if (typeof gtag === 'function') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
    }

    // Track CTA clicks
    document.querySelectorAll('.btn-primary, .btn-whatsapp, .whatsapp-float').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('CTA', 'click', 'WhatsApp Contact');
        });
    });

    // ============================================
    // PRELOADER (optional enhancement)
    // ============================================
    
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Trigger initial animations after page load
        setTimeout(() => {
            handleScrollReveal();
        }, 100);
    });

    // ============================================
    // SERVICE WORKER REGISTRATION (for PWA - future)
    // ============================================
    
    // Placeholder for future PWA functionality
    // if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker.register('/sw.js');
    // }

})();

