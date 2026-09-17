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

    const overlay = document.createElement("div")
    overlay.className = "home-lightbox"
    overlay.hidden = true
    overlay.innerHTML = `
        <div class="home-lightbox__backdrop" data-home-lightbox-close></div>
        <button type="button" class="home-lightbox__close" data-home-lightbox-close aria-label="Close gallery">&times;</button>
        <button type="button" class="home-lightbox__nav home-lightbox__nav--prev" data-home-lightbox-prev aria-label="Previous photo">&#10094;</button>
        <figure class="home-lightbox__figure">
            <img class="home-lightbox__image" alt="">
            <figcaption class="home-lightbox__caption"></figcaption>
        </figure>
        <button type="button" class="home-lightbox__nav home-lightbox__nav--next" data-home-lightbox-next aria-label="Next photo">&#10095;</button>
    `
    document.body.appendChild(overlay)

    const imageEl = overlay.querySelector(".home-lightbox__image")
    const captionEl = overlay.querySelector(".home-lightbox__caption")

    function render() {
        const src = uniquePhotos[index]
        imageEl.src = src
        imageEl.alt = `Property photo ${index + 1} of ${uniquePhotos.length}`
        captionEl.textContent = `${index + 1} / ${uniquePhotos.length}`
    }

    function openAt(startIndex) {
        index = Math.max(0, Math.min(startIndex, uniquePhotos.length - 1))
        render()
        overlay.hidden = false
        document.body.classList.add("home-lightbox-open")
    }

    function close() {
        overlay.hidden = true
        document.body.classList.remove("home-lightbox-open")
        imageEl.removeAttribute("src")
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
            close()
        } else if (event.target.closest("[data-home-lightbox-next]")) {
            next()
        } else if (event.target.closest("[data-home-lightbox-prev]")) {
            prev()
        }
    })

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
        }
    })
})()
