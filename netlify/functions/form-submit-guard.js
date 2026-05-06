const BLOCKED_PHRASES = [
    "i currently own several rental units across arizona and am looking for a dependable property manager who can oversee these properties effectively. as i work toward expanding my real estate portfolio, managing everything on my own has become increasingly demanding, and i'm reaching the point where i need dedicated support to ensure everything continues to run smoothly."
]

function normalizeText(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/\u2019/g, "'")
        .replace(/\s+/g, " ")
        .trim()
}

function toFormDataMap(rawBody) {
    const params = new URLSearchParams(rawBody || "")
    const map = new Map()

    for (const [key, value] of params.entries()) {
        map.set(key, value)
    }

    return map
}

function hasBlockedPhrase(values) {
    const combined = normalizeText(values.join(" "))
    return BLOCKED_PHRASES.some((phrase) => combined.includes(phrase))
}

function buildOrigin(headers) {
    const host = headers.host || headers.Host
    const proto = headers["x-forwarded-proto"] || "https"

    if (!host) {
        return null
    }

    return `${proto}://${host}`
}

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed"
        }
    }

    const formFields = toFormDataMap(event.body || "")
    const values = Array.from(formFields.values()).filter((value) => typeof value === "string" && value.trim())

    if (hasBlockedPhrase(values)) {
        return {
            statusCode: 422,
            body: "Blocked spam phrase detected."
        }
    }

    const origin = buildOrigin(event.headers || {})
    if (!origin) {
        return {
            statusCode: 500,
            body: "Unable to determine request origin."
        }
    }

    const response = await fetch(`${origin}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: event.body || ""
    })

    if (!response.ok) {
        return {
            statusCode: 502,
            body: "Unable to process form submission."
        }
    }

    const successRedirect = formFields.get("_success_redirect") || "/submission-complete/"

    return {
        statusCode: 303,
        headers: {
            Location: successRedirect
        },
        body: ""
    }
}
