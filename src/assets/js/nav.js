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

function setAriaExpanded(element, expanded) {
    if (!element) return;
    element.setAttribute("aria-expanded", expanded ? "true" : "false");
}

function setBackgroundInert(inert) {
    document.querySelectorAll("a.skip, main, footer").forEach((element) => {
        if (inert) element.setAttribute("inert", "");
        else element.removeAttribute("inert");
    });
}

function isShown(element) {
    if (!element || element.hasAttribute("disabled")) return false;
    const style = window.getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden" && element.getClientRects().length > 0;
}

function menuFocusables() {
    return Array.from(navbarMenu.querySelectorAll("a[href], button, input, select, textarea")).filter(isShown);
}

// Toggle hamburger menu
function toggleMenu() {
    hamburgerMenu.classList.toggle("cs-active");
    navbarMenu.classList.toggle("cs-active");
    bodyElement.classList.toggle("cs-open");
    const expanded = hamburgerMenu.classList.contains("cs-active");
    setAriaExpanded(hamburgerMenu, expanded);
    hamburgerMenu.setAttribute("aria-label", expanded ? "Close menu" : "Open menu");
    setBackgroundInert(expanded && isMobile());
}

// Toggle dropdowns on mobile
function toggleDropdown(element) {
    if (!element) return;
    element.classList.toggle("cs-active");
    const button = element.querySelector(".cs-dropdown-button");
    setAriaExpanded(button, element.classList.contains("cs-active"));
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
            setAriaExpanded(button, false);
        }
    });

    element.addEventListener("keydown", (event) => {
        const button = element.querySelector(".cs-dropdown-button");
        if ((event.key === "Enter" || event.key === " ") && event.target === button) {
            event.preventDefault();
            toggleDropdown(element);
        }
        if (event.key === "Escape") {
            escapePressed = true;
            element.classList.remove("cs-active");
            setAriaExpanded(button, false);
            if (button) button.focus();
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

window.matchMedia("(max-width: 63.9375rem)").addEventListener("change", () => {
    const open = hamburgerMenu.classList.contains("cs-active");
    setBackgroundInert(open && isMobile());
});

// Keep keyboard focus inside the open phone menu
document.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || !isMobile() || !hamburgerMenu.classList.contains("cs-active")) return;
    const items = menuFocusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !navbarMenu.contains(active))) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && (active === last || !navbarMenu.contains(active))) {
        event.preventDefault();
        first.focus();
    }
});

// Escape key closes nav
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && hamburgerMenu.classList.contains("cs-active")) {
        toggleMenu();
        hamburgerMenu.focus();
    }
});

const faqItems = Array.from(document.querySelectorAll('.cs-faq-item'));
faqItems.forEach((item, index) => {
    const button = item.querySelector('button');
    const panel = item.querySelector('.cs-item-p');
    if (!button || !panel) return;
    if (!panel.id) panel.id = `faq-panel-${index}`;
    button.setAttribute('aria-controls', panel.id);
    const setOpen = (open) => {
        item.classList.toggle('active', open);
        button.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) panel.removeAttribute('hidden');
        else panel.setAttribute('hidden', '');
    };
    setOpen(item.classList.contains('active'));
    button.addEventListener('click', () => {
        setOpen(button.getAttribute('aria-expanded') !== 'true');
    });
});

const inquirySelect = document.querySelector('#inquiry-purpose-1333');
if (inquirySelect) {
    inquirySelect.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'ArrowDown') return;
        event.preventDefault();
        if (typeof inquirySelect.showPicker === 'function') {
            inquirySelect.showPicker();
        }
    });
}

document.querySelectorAll('a.cs-big-link').forEach((link) => {
    if (!link.getAttribute('aria-label') && !link.textContent.trim()) {
        link.setAttribute('aria-label', 'Play the SunSeeker Rentals video');
    }
});

const skipLink = document.querySelector("a.skip");
const mainContent = document.getElementById("main");
if (skipLink && mainContent) {
    skipLink.addEventListener("click", () => {
        mainContent.focus({ preventScroll: true });
        mainContent.scrollIntoView();
    });
}

document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    const label = link.getAttribute('aria-label');
    if (label) {
        if (!/new tab/i.test(label)) {
            link.setAttribute('aria-label', `${label} (opens in a new tab)`);
        }
        return;
    }
    if (link.querySelector('.sr-only')) return;
    const note = document.createElement('span');
    note.className = 'sr-only';
    note.textContent = ' (opens in a new tab)';
    link.appendChild(note);
});
                                
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