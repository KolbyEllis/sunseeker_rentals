// Select DOM elements
const bodyElement = document.body;
const navbarMenu = document.querySelector("#cs-navigation");
const hamburgerMenu = document.querySelector("#cs-navigation .cs-toggle");
const navLinks = document.querySelectorAll("#cs-navigation .cs-li-link[href]");
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

// Set active nav link based only on current path
function setActiveLinkByPath() {
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        // Remove trailing slash for comparison
        const cleanHref = href.replace(/\/$/, "");
        const cleanPath = currentPath.replace(/\/$/, "");
        if (cleanHref === cleanPath) {
            link.classList.add("cs-active");
        } else {
            link.classList.remove("cs-active");
        }
    });
}

// DOM loaded
document.addEventListener("DOMContentLoaded", () => {
    setActiveLinkByPath(); // Re-enabled

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

document.addEventListener('DOMContentLoaded', function() {
  var select = document.querySelector('#contact-1333 select.cs-input');
  if (select) {
    function updateSelectColor() {
      if (select.value === "") {
        select.style.color = "#b0b0b0"; // Lighter grey for placeholder
      } else {
        select.style.color = "#222"; // Normal text color
      }
    }
    updateSelectColor();
    select.addEventListener('change', updateSelectColor);
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
    link.addEventListener("click", setActiveLinkByPath);
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

document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
  const selected = dropdown.querySelector('.custom-selected');
  const options = dropdown.querySelector('.custom-options');
  const input = dropdown.querySelector('input[type="hidden"]');
  function updateSelectedState() {
    if (input.value) {
      dropdown.classList.add('has-value');
    } else {
      dropdown.classList.remove('has-value');
    }
  }
  selected.addEventListener('click', () => {
    dropdown.classList.toggle('open');
  });
  options.querySelectorAll('li').forEach(option => {
    option.addEventListener('click', () => {
      selected.textContent = option.textContent;
      input.value = option.getAttribute('data-value');
      dropdown.classList.remove('open');
      options.querySelectorAll('li').forEach(li => li.classList.remove('active'));
      option.classList.add('active');
      updateSelectedState();
    });
  });
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
  });
  dropdown.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      dropdown.classList.toggle('open');
      e.preventDefault();
    }
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
    }
  });
  updateSelectedState();
});                                