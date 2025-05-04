// Main JavaScript file for Praana Ventures website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize custom cursor (check for touch devices)
    if (!('ontouchstart' in window || navigator.maxTouchPoints)) {
        initCustomCursor();
    }

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize mobile menu
    initMobileMenu();

    // Initialize header scroll effect
    initHeaderScroll();

    // Initialize smooth scrolling for anchor links
    initSmoothScroll();

    // Initialize active nav link update on scroll
    initScrollSpy(); // Renamed for clarity
});

// Custom cursor functionality
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (!cursorDot || !cursorOutline) {
        console.warn("Custom cursor elements not found.");
        return;
    }

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    let isMoving = false;

    window.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isMoving) {
            requestAnimationFrame(animateCursor);
            isMoving = true;
        }
    });

    function animateCursor() {
        // Dot follows instantly
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

        // Outline has a slight delay (lerp)
        const easing = 0.15;
        outlineX += (mouseX - outlineX) * easing;
        outlineY += (mouseY - outlineY) * easing;
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;

        // Check distance to decide if animation frame is needed
        const dx = mouseX - outlineX;
        const dy = mouseY - outlineY;
        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
            requestAnimationFrame(animateCursor);
        } else {
            isMoving = false; // Stop animation loop when cursor stops
        }
    }


    // Add hover effect for links and buttons using event delegation for performance
    document.body.addEventListener('mouseover', (e) => {
        if (e.target.matches('a, button, .btn, input[type="submit"], input[type="button"]')) {
            cursorOutline.style.width = '50px'; // Slightly smaller interaction size
            cursorOutline.style.height = '50px';
            cursorOutline.style.borderColor = 'var(--accent-color)'; // Use accent color
            cursorOutline.style.borderWidth = '3px';
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        if (e.target.matches('a, button, .btn, input[type="submit"], input[type="button"]')) {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.borderColor = 'var(--theme-color)'; // Back to theme color
             cursorOutline.style.borderWidth = '2px';
        }
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function() {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
    });

    // Show cursor when entering window
    document.addEventListener('mouseenter', function() {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
    });
}

// Scroll animations
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-element');

    if (!revealElements.length) return; // Exit if no elements found

    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    };

    const observer = new IntersectionObserver(revealCallback, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element);
    });
}


// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const body = document.body; // Cache body selector

    if (!mobileMenuToggle || !nav) {
         console.warn("Mobile menu toggle or nav element not found.");
        return;
    }

    mobileMenuToggle.addEventListener('click', function() {
        const isActive = mobileMenuToggle.classList.toggle('active');
        nav.classList.toggle('active', isActive); // Use second arg for toggle
        body.classList.toggle('menu-open', isActive); // Prevent body scroll when menu is open

        // Optional: Add ARIA attributes for accessibility
        mobileMenuToggle.setAttribute('aria-expanded', isActive);
        nav.setAttribute('aria-hidden', !isActive);
    });

    // Close menu when clicking on a link (using event delegation on nav)
    nav.addEventListener('click', function(e) {
        if (e.target.matches('.nav-link')) {
            mobileMenuToggle.classList.remove('active');
            nav.classList.remove('active');
            body.classList.remove('menu-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            nav.setAttribute('aria-hidden', 'true');
        }
    });

    // Optional: Close menu if clicking outside of it
    document.addEventListener('click', function(e) {
        if (nav.classList.contains('active') && !nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            nav.classList.remove('active');
            body.classList.remove('menu-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            nav.setAttribute('aria-hidden', 'true');
        }
    });
}


// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    const scrollThreshold = 50; // Pixels to scroll before adding class

    if (!header) {
        console.warn("Header element not found.");
        return;
    }

    let lastScrollY = window.scrollY;
    let ticking = false; // Use requestAnimationFrame for performance

    function updateHeader() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        // Add hide/show on scroll direction change (optional)
        // if (window.scrollY > lastScrollY && window.scrollY > header.offsetHeight) {
        //     header.classList.add('hidden'); // Add CSS for .header.hidden { top: -100px; }
        // } else {
        //     header.classList.remove('hidden');
        // }
        lastScrollY = window.scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

     // Initial check in case page loads scrolled
    updateHeader();
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    // Select links starting with '#' but not just '#'
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            try {
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault(); // Prevent default jump only if target exists

                    // Calculate offset based on header height
                    const header = document.querySelector('.header');
                    // Use 80px as a fallback if header isn't found or height is 0
                    const headerHeight = header ? header.offsetHeight : 80;
                    const offset = 20; // Additional small offset

                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerHeight - offset;


                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                } else {
                     console.warn(`Smooth scroll target not found for selector: ${targetId}`);
                }
            } catch (error) {
                // Catch invalid selectors
                console.error(`Invalid selector for smooth scroll: ${targetId}`, error);
            }
        });
    });
}


// Update active nav link based on scroll position (Scrollspy)
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]'); // Select only sections with IDs
    const navLinks = document.querySelectorAll('.nav-list .nav-link'); // More specific selector

    if (!sections.length || !navLinks.length) {
        // console.warn("Scrollspy sections or nav links not found.");
        return;
    }

    let ticking = false;

    function updateActiveLink() {
        let currentSectionId = '';
        const headerOffset = document.querySelector('.header')?.offsetHeight || 80;
         const scrollPosition = window.scrollY + headerOffset + 50; // Add a bit more offset

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if the link's href matches the current section ID
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
        ticking = false;
    }


     window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateActiveLink);
            ticking = true;
        }
    });

     // Initial check
     updateActiveLink();
}

// Add a class to body when menu is open to prevent background scroll
// Added this logic directly into initMobileMenu() for better encapsulation.