/**
 * Sync public AppFolio listings into src/_data/homes.json (upsert by address slug).
 * Keeps archived homes when AppFolio unposts so SEO pages survive.
 */
const fs = require("node:fs")
const path = require("node:path")

const LISTINGS_HOST = process.env.APPFOLIO_LISTINGS_HOST || "https://sunseeker.appfolio.com"
const LISTINGS_INDEX = `${LISTINGS_HOST}/listings`
const DATA_PATH = path.join(__dirname, "..", "src", "_data", "homes.json")

async function fetchText(url) {
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "SunSeekerRentalsListingSync/1.0 (+https://www.sunseekerrentals.com)",
                Accept: "text/html,application/xhtml+xml"
            }
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch ${url} (${response.status})`)
        }

        return response.text()
    } catch (error) {
        const code = error && error.cause && error.cause.code
        if (code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE") {
            throw new Error(
                `TLS certificate error fetching ${url}. On Windows try: node --use-system-ca scripts/sync-appfolio-listings.js`
            )
        }
        throw error
    }
}

function decodeHtml(value) {
    return String(value || "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .trim()
}

function slugifyAddress(address) {
    return decodeHtml(address)
        .toLowerCase()
        .replace(/\bas\b(?=\s*\d{5})/g, "az")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
}

function unique(values) {
    return [...new Set(values.filter(Boolean))]
}

function extractListingIds(indexHtml) {
    const ids = []
    const pattern = /\/listings\/detail\/([0-9a-f-]{36})/gi
    let match

    while ((match = pattern.exec(indexHtml))) {
        ids.push(match[1].toLowerCase())
    }

    return unique(ids)
}

function extractMeta(html, property) {
    const re = new RegExp(
        `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']*)["']|<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${property}["']`,
        "i"
    )
    const match = html.match(re)
    return decodeHtml((match && (match[1] || match[2])) || "")
}

function extractPhotos(html) {
    const photos = []
    const pattern = /https:\/\/images\.cdn\.appfolio\.com\/[^"'>\s]+\/large\.jpg/gi
    let match

    while ((match = pattern.exec(html))) {
        photos.push(match[0])
    }

    // Fallback to medium if large links are missing
    if (!photos.length) {
        const medium = /https:\/\/images\.cdn\.appfolio\.com\/[^"'>\s]+\/medium\.jpg/gi
        while ((match = medium.exec(html))) {
            photos.push(match[0].replace(/\/medium\.jpg$/i, "/large.jpg"))
        }
    }

    return unique(photos)
}

function extractTagText(html, regex) {
    const match = html.match(regex)
    if (!match) {
        return ""
    }
    return decodeHtml(match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " "))
}

function parseSummary(summary) {
    const bedsMatch = summary.match(/([\d.]+)\s*bd/i)
    const bathsMatch = summary.match(/([\d.]+)\s*ba/i)
    const sqftMatch = summary.match(/([\d,]+)\s*Sq\.?\s*Ft/i)

    return {
        beds: bedsMatch ? bedsMatch[1] : "",
        baths: bathsMatch ? bathsMatch[1] : "",
        sqft: sqftMatch ? sqftMatch[1].replace(/,/g, "") : ""
    }
}

function extractListItems(html, listClass) {
    const blockMatch = html.match(new RegExp(`<ul[^>]*class="[^"]*${listClass}[^"]*"[^>]*>([\\s\\S]*?)</ul>`, "i"))
    if (!blockMatch) {
        return []
    }

    const items = []
    const itemRe = /<li[^>]*>([\s\S]*?)<\/li>/gi
    let match

    while ((match = itemRe.exec(blockMatch[1]))) {
        items.push(decodeHtml(match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")))
    }

    return items.filter(Boolean)
}

function extractRent(html, rentalTerms) {
    const rentTerm = rentalTerms.find((item) => /^Rent:/i.test(item))
    if (rentTerm) {
        const match = rentTerm.match(/\$[\d,]+/)
        if (match) {
            return match[0]
        }
    }

    const sidebarMatch = html.match(/<div>\s*RENT\s*<\/div>[\s\S]*?\$[\d,]+/i)
    if (sidebarMatch) {
        const match = sidebarMatch[0].match(/\$[\d,]+/)
        if (match) {
            return match[0]
        }
    }

    return ""
}

function parseDetail(html, appfolioId) {
    const address = extractMeta(html, "og:title")
    const description =
        extractMeta(html, "og:description") ||
        extractTagText(html, /class="listing-detail__description[^"]*"[^>]*>([\s\S]*?)<\/p>/i)
    const marketingTitle = extractTagText(html, /<h2 class="listing-detail__title">([\s\S]*?)<\/h2>/i)
    const summary = extractTagText(html, /class="header__summary[^"]*"[^>]*>([\s\S]*?)<\/p>/i)
    const { beds, baths, sqft } = parseSummary(summary)
    const rentalTerms = extractListItems(html, "js-show-rental-terms")
    const petPolicy = extractListItems(html, "js-pet-policy-list")
    const photos = extractPhotos(html)
    const slug = slugifyAddress(address)

    if (!slug || !address) {
        throw new Error(`Could not parse address for listing ${appfolioId}`)
    }

    return {
        slug,
        address,
        city: (address.split(",")[1] || "").trim(),
        marketingTitle,
        description,
        beds,
        baths,
        sqft,
        rent: extractRent(html, rentalTerms),
        rentalTerms,
        petPolicy,
        photos,
        photoCount: photos.length,
        appfolioId,
        appfolioUrl: `${LISTINGS_HOST}/listings/detail/${appfolioId}`,
        currentlyPosted: true,
        lastSyncedAt: new Date().toISOString()
    }
}

function loadExistingHomes() {
    if (!fs.existsSync(DATA_PATH)) {
        return []
    }

    try {
        const parsed = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"))
        return Array.isArray(parsed) ? parsed : []
    } catch (error) {
        console.warn("Could not parse existing homes.json, starting fresh:", error.message)
        return []
    }
}

function upsertHome(existingHomes, incoming) {
    const bySlug = existingHomes.findIndex((home) => home.slug === incoming.slug)
    if (bySlug !== -1) {
        const previous = existingHomes[bySlug]
        existingHomes[bySlug] = {
            ...previous,
            ...incoming,
            // Prefer newest gallery when AppFolio still has photos; otherwise keep archive
            photos: incoming.photos.length ? incoming.photos : previous.photos || [],
            photoCount: (incoming.photos.length ? incoming.photos : previous.photos || []).length
        }
        return "updated"
    }

    const byId = existingHomes.findIndex((home) => home.appfolioId === incoming.appfolioId)
    if (byId !== -1) {
        const previous = existingHomes[byId]
        existingHomes[byId] = {
            ...previous,
            ...incoming,
            // Keep original slug/URL if address text drifted slightly
            slug: previous.slug || incoming.slug,
            photos: incoming.photos.length ? incoming.photos : previous.photos || [],
            photoCount: (incoming.photos.length ? incoming.photos : previous.photos || []).length
        }
        return "updated"
    }

    existingHomes.push(incoming)
    return "created"
}

function markMissingAsUnposted(existingHomes, activeIds) {
    let archived = 0

    for (const home of existingHomes) {
        if (home.appfolioId && !activeIds.has(home.appfolioId) && home.currentlyPosted) {
            home.currentlyPosted = false
            home.unpostedAt = new Date().toISOString()
            archived += 1
        }
    }

    return archived
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
    console.log(`Fetching listings index: ${LISTINGS_INDEX}`)
    const indexHtml = await fetchText(LISTINGS_INDEX)
    const listingIds = extractListingIds(indexHtml)
    console.log(`Found ${listingIds.length} public listings`)

    const homes = loadExistingHomes()
    let created = 0
    let updated = 0

    for (const id of listingIds) {
        const detailUrl = `${LISTINGS_HOST}/listings/detail/${id}`
        try {
            const html = await fetchText(detailUrl)
            const parsed = parseDetail(html, id)
            const result = upsertHome(homes, parsed)
            if (result === "created") {
                created += 1
            } else {
                updated += 1
            }
            console.log(`${result}: ${parsed.slug} (${parsed.photoCount} photos)`)
        } catch (error) {
            console.error(`Failed on ${detailUrl}:`, error.message)
        }

        await sleep(250)
    }

    const archived = markMissingAsUnposted(homes, new Set(listingIds))
    homes.sort((a, b) => String(a.address).localeCompare(String(b.address)))

    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true })
    fs.writeFileSync(DATA_PATH, `${JSON.stringify(homes, null, 2)}\n`, "utf8")

    console.log(
        `Done. total=${homes.length} created=${created} updated=${updated} markedUnposted=${archived} -> ${DATA_PATH}`
    )
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
