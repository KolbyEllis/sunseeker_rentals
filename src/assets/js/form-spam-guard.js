// Blocks a known recurring scam phrase before form submission.
(function () {
    const blockedPhrases = [
        "i currently own several rental units across arizona and am looking for a dependable property manager who can oversee these properties effectively. as i work toward expanding my real estate portfolio, managing everything on my own has become increasingly demanding, and i'm reaching the point where i need dedicated support to ensure everything continues to run smoothly."
    ]

    function normalizeText(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/\u2019/g, "'")
            .replace(/\s+/g, " ")
            .trim()
    }

    function formHasBlockedPhrase(form) {
        const formData = new FormData(form)
        const values = []

        for (const value of formData.values()) {
            if (typeof value === "string" && value.trim()) {
                values.push(value)
            }
        }

        const normalizedContent = normalizeText(values.join(" "))
        return blockedPhrases.some((phrase) => normalizedContent.includes(phrase))
    }

    function showSpamMessage(form) {
        const existingMessage = form.querySelector(".form-spam-guard-message")
        if (existingMessage) {
            existingMessage.remove()
        }

        const message = document.createElement("div")
        message.className = "form-spam-guard-message"
        message.textContent = "Your message could not be submitted. Please remove promotional language and try again."
        message.style.cssText = "margin: 12px 0; padding: 10px 12px; border: 1px solid #f5c6cb; border-radius: 6px; background: #f8d7da; color: #721c24; font-size: 0.95rem;"

        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]')
        if (submitButton && submitButton.parentNode) {
            submitButton.parentNode.insertBefore(message, submitButton)
            return
        }

        form.appendChild(message)
    }

    function setupSpamGuard() {
        const forms = document.querySelectorAll("form")
        if (!forms.length) {
            return
        }

        forms.forEach((form) => {
            if (form.getAttribute("data-netlify") === "true" && (form.method || "").toLowerCase() === "post") {
                const successPath = form.getAttribute("action") || "/submission-complete/"
                let successInput = form.querySelector('input[name="_success_redirect"]')

                if (!successInput) {
                    successInput = document.createElement("input")
                    successInput.type = "hidden"
                    successInput.name = "_success_redirect"
                    form.appendChild(successInput)
                }

                successInput.value = successPath
                form.setAttribute("action", "/.netlify/functions/form-submit-guard")
            }

            form.addEventListener("submit", (event) => {
                if (!formHasBlockedPhrase(form)) {
                    return
                }

                event.preventDefault()
                showSpamMessage(form)
                console.warn("Blocked known spam phrase on form submit.")
            })
        })
    }

    document.addEventListener("DOMContentLoaded", setupSpamGuard)
})()
