// On-page lightbox for /homes property photo galleries.
(function () {
    const triggers = Array.from(document.querySelectorAll("[data-home-gallery-index]"))
    if (!triggers.length) {
        return
    }

    const photos = triggers
        .map((el) => el.getAttribute("data-home-gallery-src"))
        .filter(Boolean)

    if (!photos.length) {
        return
    }

    // Deduplicate while preserving order (hero + gallery may share first photo)
    const uniquePhotos = []
    const seen = new Set()
    for (const src of photos) {
        if (!seen.has(src)) {
            seen.add(src)
            uniquePhotos.push(src)
        }
    }

    let index = 0
    let touchStartX = 0
    let touchStartY = 0
    let lastFocus = null

    const overlay = document.createElement("div")
    overlay.className = "home-lightbox"
    overlay.hidden = true
    overlay.setAttribute("role", "dialog")
    overlay.setAttribute("aria-modal", "true")
    overlay.setAttribute("aria-label", "Property photos")
    overlay.innerHTML = `
        <div class="home-lightbox__backdrop" data-home-lightbox-close></div>
        <button type="button" class="home-lightbox__close" data-home-lightbox-close aria-label="Close gallery">&times;</button>
        <button type="button" class="home-lightbox__nav home-lightbox__nav--prev" data-home-lightbox-prev aria-label="Previous photo">&#10094;</button>
        <figure class="home-lightbox__figure">
            <img class="home-lightbox__image" alt="" draggable="false">
            <figcaption class="home-lightbox__caption"></figcaption>
        </figure>
        <button type="button" class="home-lightbox__nav home-lightbox__nav--next" data-home-lightbox-next aria-label="Next photo">&#10095;</button>
    `
    document.body.appendChild(overlay)

    const imageEl = overlay.querySelector(".home-lightbox__image")
    const captionEl = overlay.querySelector(".home-lightbox__caption")

    function isMobileLightbox() {
        return window.matchMedia("(max-width: 700px)").matches
    }

    function render() {
        const src = uniquePhotos[index]
        imageEl.src = src
        imageEl.alt = `Property photo ${index + 1} of ${uniquePhotos.length}`
        captionEl.textContent = `${index + 1} / ${uniquePhotos.length}`
    }

    function focusableInLightbox() {
        return Array.from(overlay.querySelectorAll("button")).filter((el) => !el.disabled)
    }

    function openAt(startIndex) {
        lastFocus = document.activeElement
        index = Math.max(0, Math.min(startIndex, uniquePhotos.length - 1))
        render()
        overlay.hidden = false
        document.body.classList.add("home-lightbox-open")
        const closeBtn = overlay.querySelector(".home-lightbox__close")
        if (closeBtn) closeBtn.focus()
    }

    function close() {
        overlay.hidden = true
        document.body.classList.remove("home-lightbox-open")
        imageEl.removeAttribute("src")
        if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus()
    }

    function next() {
        index = (index + 1) % uniquePhotos.length
        render()
    }

    function prev() {
        index = (index - 1 + uniquePhotos.length) % uniquePhotos.length
        render()
    }

    triggers.forEach((trigger) => {
        trigger.addEventListener("click", (event) => {
            event.preventDefault()
            const src = trigger.getAttribute("data-home-gallery-src")
            const start = Math.max(0, uniquePhotos.indexOf(src))
            openAt(start === -1 ? 0 : start)
        })
    })

    overlay.addEventListener("click", (event) => {
        if (event.target.closest("[data-home-lightbox-close]")) {
            // On mobile, only the X closes — backdrop taps were too easy to hit by accident
            if (
                event.target.classList.contains("home-lightbox__backdrop") &&
                isMobileLightbox()
            ) {
                return
            }
            close()
        } else if (event.target.closest("[data-home-lightbox-next]")) {
            next()
        } else if (event.target.closest("[data-home-lightbox-prev]")) {
            prev()
        }
    })

    overlay.addEventListener(
        "touchstart",
        (event) => {
            if (overlay.hidden || !event.touches.length) {
                return
            }
            touchStartX = event.touches[0].clientX
            touchStartY = event.touches[0].clientY
        },
        { passive: true }
    )

    overlay.addEventListener(
        "touchend",
        (event) => {
            if (overlay.hidden || !event.changedTouches.length) {
                return
            }
            const dx = event.changedTouches[0].clientX - touchStartX
            const dy = event.changedTouches[0].clientY - touchStartY
            if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) {
                return
            }
            if (dx < 0) {
                next()
            } else {
                prev()
            }
        },
        { passive: true }
    )

    document.addEventListener("keydown", (event) => {
        if (overlay.hidden) {
            return
        }
        if (event.key === "Escape") {
            close()
        } else if (event.key === "ArrowRight") {
            next()
        } else if (event.key === "ArrowLeft") {
            prev()
        } else if (event.key === "Tab") {
            const nodes = focusableInLightbox()
            if (!nodes.length) return
            const first = nodes[0]
            const last = nodes[nodes.length - 1]
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }
    })
})()
