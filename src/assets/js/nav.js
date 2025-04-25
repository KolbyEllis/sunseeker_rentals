// Select DOM elements
const bodyElement = document.body;
const navbarMenu = document.querySelector("#cs-navigation");
const hamburgerMenu = document.querySelector("#cs-navigation .cs-toggle");
const navLinks = document.querySelectorAll("#cs-navigation .cs-li-link");
const dropdownElements = document.querySelectorAll(".cs-dropdown");
const dropdownLinks = document.querySelectorAll(".cs-drop-li > .cs-li-link");
const tertiaryDropTriggers = document.querySelectorAll("#cs-navigation .cs-drop3-main");

// Detect mobile
const isMobile = () => window.matchMedia("(max-width: 63.9375rem)").matches;

// Toggle aria-expanded for accessibility
function toggleAriaExpanded(element) {
    if (!element) return;
    const expanded = element.getAttribute("aria-expanded") === "true";
    element.setAttribute("aria-expanded", !expanded);
}

// Toggle hamburger menu
function toggleMenu() {
    hamburgerMenu.classList.toggle("cs-active");
    navbarMenu.classList.toggle("cs-active");
    bodyElement.classList.toggle("cs-open");
    toggleAriaExpanded(hamburgerMenu);
}

// Toggle dropdowns on mobile
function toggleDropdown(element) {
    if (!element) return;
    element.classList.toggle("cs-active");
    const button = element.querySelector(".cs-dropdown-button");
    toggleAriaExpanded(button);
}

// Set active nav link, except for Contact page
function setActiveLink(event) {
    const href = event.currentTarget.getAttribute("href");

    if (href === "/contact" || href === "/contact/") {
        localStorage.removeItem("activeNavLink");
        return;
    }

    navLinks.forEach(link => link.classList.remove("cs-active"));
    event.currentTarget.classList.add("cs-active");
    localStorage.setItem("activeNavLink", href);
}

// DOM loaded
document.addEventListener("DOMContentLoaded", () => {
    const savedLink = localStorage.getItem("activeNavLink");
    const currentPath = window.location.pathname;

    // Prevent active underline on contact page
    if (currentPath !== "/contact" && currentPath !== "/contact/") {
        navLinks.forEach(link => {
            const href = link.getAttribute("href");
            if (href === currentPath || href === savedLink) {
                link.classList.add("cs-active");
            }
        });
    }

    // Prevent dropdown collapse too early on mobile
    if (isMobile()) {
        dropdownLinks.forEach(link => {
            link.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                const href = this.getAttribute("href");
                setTimeout(() => {
                    window.location.href = href;
                }, 100);
            });
        });
    }
});

// Hamburger toggle
hamburgerMenu.addEventListener("click", toggleMenu);

// Close menu if background clicked
navbarMenu.addEventListener("click", (event) => {
    if (event.target === navbarMenu && navbarMenu.classList.contains("cs-active")) {
        toggleMenu();
    }
});

// Track nav link clicks
navLinks.forEach(link => {
    link.addEventListener("click", setActiveLink);
});

// Dropdown behavior
dropdownElements.forEach(element => {
    let escapePressed = false;

    if (isMobile()) {
        element.addEventListener("click", () => toggleDropdown(element));
    }

    element.addEventListener("focusout", (event) => {
        if (escapePressed) {
            escapePressed = false;
            return;
        }
        if (!element.contains(event.relatedTarget)) {
            element.classList.remove("cs-active");
            const button = element.querySelector(".cs-dropdown-button");
            toggleAriaExpanded(button);
        }
    });

    element.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleDropdown(element);
        }
        if (event.key === "Escape") {
            escapePressed = true;
            element.classList.remove("cs-active");
        }
    });
});

// Tertiary dropdown on mobile
if (isMobile()) {
    tertiaryDropTriggers.forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            e.stopPropagation();
            const parent = trigger.closest(".cs-drop-li");
            if (parent) {
                parent.classList.toggle("drop3-active");
            }
        });
    });
}

// Handle Enter key nav
dropdownLinks.forEach(link => {
    link.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            window.location.href = link.href;
        }
    });
});

// Escape key closes nav
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && hamburgerMenu.classList.contains("cs-active")) {
        toggleMenu();
    }
});

const faqItems = Array.from(document.querySelectorAll('.cs-faq-item'));
        for (const item of faqItems) {
            const onClick = () => {
            item.classList.toggle('active')
        }
        item.addEventListener('click', onClick)
        }
                                