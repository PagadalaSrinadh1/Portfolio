// Wait for the entire HTML document to be fully loaded and parsed before executing the script.
document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS with your Public Key.
    // This is a self-invoking function to keep the EmailJS initialization contained.
    (function() {
        emailjs.init({
            publicKey: "-p5xvYeuD3V5ncFIy", // Your updated EmailJS Public Key
        });
    })();

    // --- NEW: Set dynamic copyright year in the footer ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    // Smooth scrolling for navigation links in the header and footer.
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        // Exclude the external resume link from this logic
        if (link.getAttribute('target') !== '_blank') {
            link.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent the default anchor link behavior (jumping).
                let targetId = this.getAttribute('href'); // Get the href attribute (e.g., "#skills").

                // Special handling for links pointing to the top of the page (# or #home).
                if (targetId === '#' || targetId === '#home') {
                     document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
                } else {
                    // For other sections, calculate the correct scroll position.
                    const targetElement = document.querySelector(targetId); // Find the target section element.
                    if (targetElement) {
                        const headerOffset = document.getElementById('header').offsetHeight; // Get the height of the fixed header.
                        const elementPosition = targetElement.getBoundingClientRect().top; // Get position relative to viewport.
                        // Calculate the absolute position from the top of the page, adjusting for the fixed header.
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        // Scroll to the calculated position smoothly.
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
                // Close mobile menu if it's open after a navigation link is clicked.
                const mainNav = document.querySelector('.nav-links');
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active'); // Hide the mobile menu.
                    // Change the menu icon back to bars.
                    document.querySelector('.menu-toggle i').classList.replace('fa-times', 'fa-bars');
                }
            });
        }
    });

    // Mobile menu toggle functionality.
    const menuToggle = document.querySelector('.menu-toggle'); // The hamburger icon button.
    const mainNav = document.querySelector('.nav-links');      // The navigation links container.
    const menuIcon = menuToggle ? menuToggle.querySelector('i') : null; // The <i> element for the icon.

    // Ensure all elements exist before adding the event listener.
    if (menuToggle && mainNav && menuIcon) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active'); // Toggle the 'active' class to show/hide the menu.
            // Change the icon from bars to 'X' (times) and vice-versa.
            if (mainNav.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    }

    // --- REMOVED: Redundant View Resume button functionality ---
    // The link is now a standard <a> tag and works without JavaScript.

    // Contact Form submission with EmailJS (with improved error handling).
    const contactForm = document.getElementById('contactForm');
    if (contactForm) { // Check if the form exists.
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission which reloads the page.

            const serviceID = 'service_1ev7g09'; // Your updated EmailJS Service ID.
            const templateID = 'template_z5soc1w'; // Your updated EmailJS Template ID.
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent; // Store original button text.

            // Update button to indicate sending and disable it.
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Send form data using EmailJS.
            // 'this' refers to the form element itself.
            emailjs.sendForm(serviceID, templateID, this)
                .then((response) => {
                    // Success callback.
                    console.log('SUCCESS!', response.status, response.text);
                    alert('Message sent successfully!');
                    contactForm.reset(); // Reset the form fields after successful submission.
                }, (error) => {
                    // Error callback - This is the improved part for debugging.
                    console.error('FAILED...', error); // Log the full error object to the browser console.
                    alert('Failed to send the message. Please check the console (F12) for details and try again.');
                }).finally(() => {
                    // This will run whether the email sent successfully or failed.
                    submitButton.textContent = originalButtonText; // Restore original button text.
                    submitButton.disabled = false; // Re-enable the button.
                });
        });
    }

    // Active link highlighting on scroll.
    const sections = document.querySelectorAll('main section[id]');
    const header = document.getElementById('header');

    function changeNavActiveState() {
        if (!header) return;

        const headerHeight = header.offsetHeight;
        let index = sections.length;

        while(--index >= 0 && window.scrollY + headerHeight + 50 < sections[index].offsetTop) {}

        document.querySelectorAll('nav .nav-links a').forEach((link) => {
            if (link.getAttribute('target') !== '_blank') {
                link.classList.remove('active');
            }
        });

        if (index >= 0) {
            const activeLink = document.querySelector(`nav .nav-links a[href="#${sections[index].id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        } else {
             const homeLink = document.querySelector(`nav .nav-links a[href="#home"]`);
             if (homeLink) homeLink.classList.add('active');
        }
    }

    if(sections.length > 0) {
        changeNavActiveState();
        window.addEventListener('scroll', changeNavActiveState);
    } else {
        const homeLink = document.querySelector(`nav .nav-links a[href="#home"]`);
        if (homeLink) homeLink.classList.add('active');
    }
});