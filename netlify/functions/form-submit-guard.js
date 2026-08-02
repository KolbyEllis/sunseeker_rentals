const BLOCKED_PHRASES = [
    "i currently own several rental units across arizona and am looking for a dependable property manager who can oversee these properties effectively. as i work toward expanding my real estate portfolio, managing everything on my own has become increasingly demanding, and i'm reaching the point where i need dedicated support to ensure everything continues to run smoothly."
]

const TENANT_INQUIRY = "I am looking to rent as a tenant"
const DRIPLEE_SUBMIT_URL = "https://driplee.com/.netlify/functions/submit-rental-lead"
const DRIPLEE_FORM_KEY =
    process.env.DRIPLEE_FORM_KEY || "39a1cc86ca3f41d95e10b2637b6539dbd29fdce205bdfd1d"

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

function getField(formFields, ...names) {
    for (const name of names) {
        const value = formFields.get(name)
        if (typeof value === "string" && value.trim()) {
            return value.trim()
        }
    }

    return ""
}

function isTenantInquiry(formFields) {
    return getField(formFields, "Inquiry Purpose") === TENANT_INQUIRY
}

async function submitTenantLeadToDriplee(formFields) {
    const payload = {
        form_key: DRIPLEE_FORM_KEY,
        first_name: getField(formFields, "First Name", "first_name"),
        last_name: getField(formFields, "Last Name", "last_name"),
        email: getField(formFields, "Email", "email"),
        phone: getField(formFields, "Phone", "phone"),
        message: getField(formFields, "Message", "message")
    }

    const response = await fetch(DRIPLEE_SUBMIT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(payload)
    })

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "")
        throw new Error(`Driplee submit failed (${response.status}): ${errorBody}`)
    }

    return response
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

    const successRedirect = formFields.get("_success_redirect") || "/submission-complete/"

    // Tenant leads go to Driplee only (tag applied there). Skip Netlify Forms so
    // the existing Netlify → n8n path does not also create a rental lead.
    if (isTenantInquiry(formFields)) {
        try {
            await submitTenantLeadToDriplee(formFields)
        } catch (error) {
            console.error("Failed to submit tenant lead to Driplee:", error)
            return {
                statusCode: 502,
                body: "Unable to submit rental inquiry. Please try again or contact us directly."
            }
        }

        return {
            statusCode: 303,
            headers: {
                Location: successRedirect
            },
            body: ""
        }
    }

    // Owner / Other keep the existing Netlify Forms → n8n path.
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

    return {
        statusCode: 303,
        headers: {
            Location: successRedirect
        },
        body: ""
    }
}
