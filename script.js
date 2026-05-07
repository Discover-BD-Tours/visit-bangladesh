/*
 * DiscoverBD Tours – Global JavaScript
 * ---------------------------------------------------------------
 * This script provides lightweight, framework‑free enhancements for all
 * pages of the tourism demo site (index.html, coxs-bazar.html, old-dhaka.html,
 * sundarbans.html, sylhet.html).
 *
 * Features include smooth scrolling, sticky navbar effects, active link
 * highlighting, scroll‑reveal animations, FAQ accordion, mobile menu toggle,
 * image‑gallery hover hooks, button polish, basic form validation, a scroll‑to‑top
 * button, WhatsApp button pulse, and performance‑friendly debouncing.
 * ---------------------------------------------------------------
 */

(() => {
    'use strict';

    /* -----------------------------------------------------------
       Helper Functions
       ----------------------------------------------------------- */
    const debounce = (func, wait = 20) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const qs = selector => document.querySelector(selector);
    const qsa = selector => document.querySelectorAll(selector);

    const addClass = (el, cls) => el && el.classList.add(cls);
    const removeClass = (el, cls) => el && el.classList.remove(cls);
    const toggleClass = (el, cls) => el && el.classList.toggle(cls);

    /* -----------------------------------------------------------
       1. Smooth Scrolling for anchor links
       ----------------------------------------------------------- */
    const enableSmoothScroll = () => {
        document.addEventListener('click', e => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            const targetId = link.getAttribute('href').slice(1);
            if (!targetId) return;
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Update URL hash without jumping
                history.pushState(null, '', `#${targetId}`);
            }
        });
    };

    /* -----------------------------------------------------------
       2. Sticky Navbar Effects (shadow/background change)
       ----------------------------------------------------------- */
    const handleStickyNavbar = () => {
        const nav = qs('nav');
        if (!nav) return;
        const toggle = () => {
            if (window.scrollY > 50) {
                addClass(nav, 'scrolled');
            } else {
                removeClass(nav, 'scrolled');
            }
        };
        window.addEventListener('scroll', debounce(toggle, 10));
        toggle(); // initial check
    };

    /* -----------------------------------------------------------
       3. Active Navbar Highlight while scrolling
       ----------------------------------------------------------- */
    const handleActiveNavLinks = () => {
        const sections = qsa('section[id]');
        const navLinks = qsa('nav a[href^="#"]');

        if (!sections.length || !navLinks.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.4 // 40% of the section visible triggers active state
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                const link = qs(`nav a[href="#${id}"]`);
                if (entry.isIntersecting) {
                    addClass(link, 'active');
                } else {
                    removeClass(link, 'active');
                }
            });
        }, observerOptions);

        sections.forEach(sec => observer.observe(sec));
    };

    /* -----------------------------------------------------------
       4. Scroll Reveal Animations (fade‑in)
       ----------------------------------------------------------- */
    const initScrollReveal = () => {
        const revealElements = qsa('.reveal');
        if (!revealElements.length) return;

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    addClass(entry.target, 'visible');
                    observer.unobserve(entry.target); // animation once
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    };

    /* -----------------------------------------------------------
       5. FAQ Accordion (single or multiple open)
       ----------------------------------------------------------- */
    const initFAQAccordion = () => {
        const faqItems = qsa('.faq-item');
        if (!faqItems.length) return;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (!question) return;
            question.addEventListener('click', () => {
                toggleClass(item, 'active');
            });
        });
    };

    /* -----------------------------------------------------------
       6. Mobile Navbar Toggle
       ----------------------------------------------------------- */
    const initMobileMenu = () => {
        const toggleBtn = qs('#mobile-menu-toggle');
        const navMenu = qs('nav ul');
        if (!toggleBtn || !navMenu) return;

        const toggleMenu = () => {
            toggleClass(navMenu, 'open');
            toggleClass(toggleBtn, 'open');
            // ARIA for accessibility
            const expanded = navMenu.classList.contains('open');
            toggleBtn.setAttribute('aria-expanded', expanded);
        };
        toggleBtn.addEventListener('click', toggleMenu);
    };

    /* -----------------------------------------------------------
       7. Image Gallery Hover Enhancements (optional lightbox hook)
       ----------------------------------------------------------- */
    const initGalleryHover = () => {
        const galleryImages = qsa('.gallery-grid img');
        if (!galleryImages.length) return;
        galleryImages.forEach(img => {
            img.addEventListener('mouseenter', () => addClass(img, 'hovered'));
            img.addEventListener('mouseleave', () => removeClass(img, 'hovered'));
        });
    };

    /* -----------------------------------------------------------
       8. Button Hover Polish (tiny scale effect via CSS)
       ----------------------------------------------------------- */
    // The CSS can already provide a transition. JS hook left for future tweaks.

    /* -----------------------------------------------------------
       9. Form Enhancements – basic validation & loading state
       ----------------------------------------------------------- */
    const initFormEnhancements = () => {
        const forms = qsa('form'); // generic, applies to any form on page
        if (!forms.length) return;

        forms.forEach(form => {
            const submitBtn = form.querySelector('button[type="submit"], .btn');
            form.addEventListener('submit', e => {
                // Simple required validation – HTML already enforces required,
                // but we add visual feedback in case of JS‑disabled fallback.
                const requiredFields = form.querySelectorAll('[required]');
                let allValid = true;
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        allValid = false;
                        addClass(field, 'invalid');
                    } else {
                        removeClass(field, 'invalid');
                    }
                });
                if (!allValid) {
                    e.preventDefault(); // stop submission
                    return;
                }
                // Simulate loading state
                if (submitBtn) {
                    e.preventDefault(); // prevent real submission for demo
                    submitBtn.disabled = true;
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Sending...';
                    // Simulate network delay (2s)
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        // Optionally show success message – for demo we just reset form
                        form.reset();
                    }, 2000);
                }
            });
        });
    };

    /* -----------------------------------------------------------
       10. Scroll‑to‑Top Button
       ----------------------------------------------------------- */
    const initScrollToTop = () => {
        const btn = qs('#scrollTop');
        if (!btn) return;
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                addClass(btn, 'visible');
            } else {
                removeClass(btn, 'visible');
            }
        };
        btn.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        window.addEventListener('scroll', debounce(toggleVisibility, 10));
        toggleVisibility();
    };

    /* -----------------------------------------------------------
       11. WhatsApp Floating Button – pulse animation & hide on scroll
       ----------------------------------------------------------- */
    const initWhatsAppButton = () => {
        const waBtn = qs('.whatsapp-float');
        if (!waBtn) return;
        // Add pulse class once (CSS should define @keyframes pulse)
        addClass(waBtn, 'pulse');
        // Optional hide when near bottom (example threshold)
        const toggleVisibility = () => {
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;
            const scrollPos = window.scrollY + winHeight;
            // Hide button when user is within 200px of page bottom
            if (docHeight - scrollPos < 200) {
                addClass(waBtn, 'hidden');
            } else {
                removeClass(waBtn, 'hidden');
            }
        };
        window.addEventListener('scroll', debounce(toggleVisibility, 20));
    };

    /* -----------------------------------------------------------
       Initialization – DOMContentLoaded
       ----------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', () => {
        enableSmoothScroll();
        handleStickyNavbar();
        handleActiveNavLinks();
        initScrollReveal();
        initFAQAccordion();
        initMobileMenu();
        initGalleryHover();
        initFormEnhancements();
        initScrollToTop();
        initWhatsAppButton();
    });
})();
