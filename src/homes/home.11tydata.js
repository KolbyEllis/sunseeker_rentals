function parsePostalAddress(address, cityFallback) {
    const parts = String(address || "")
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)

    const streetAddress = parts[0] || ""
    const locality = parts[1] || cityFallback || ""
    const regionZip = parts[2] || ""
    const regionMatch = regionZip.match(/^([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)$/)

    return {
        "@type": "PostalAddress",
        streetAddress,
        addressLocality: locality,
        addressRegion: regionMatch ? regionMatch[1].toUpperCase() : "AZ",
        postalCode: regionMatch ? regionMatch[2] : "",
        addressCountry: "US"
    }
}

function petsAllowedFromPolicy(petPolicy) {
    if (!Array.isArray(petPolicy) || !petPolicy.length) {
        return undefined
    }

    const text = petPolicy.join(" ").toLowerCase()
    if (/not allowed/.test(text) && !/\ballowed\b/.test(text.replace(/not allowed/g, ""))) {
        return false
    }
    if (/allowed/.test(text)) {
        return true
    }
    return undefined
}

function rentNumber(rent) {
    const cleaned = String(rent || "")
        .replace(/[^0-9.]/g, "")
        .trim()
    return cleaned || undefined
}

function buildListingSchema(home, pageUrl, siteDomain) {
    if (!home || !home.address) {
        return null
    }

    const photos = Array.isArray(home.photos) ? home.photos.filter(Boolean) : []
    const url = `${siteDomain}${pageUrl}`
    const price = rentNumber(home.rent)
    const petsAllowed = petsAllowedFromPolicy(home.petPolicy)

    const about = {
        "@type": "House",
        name: home.address,
        url,
        address: parsePostalAddress(home.address, home.city)
    }

    if (photos.length) {
        about.image = photos
    }

    if (home.beds) {
        about.numberOfBedrooms = Number(home.beds)
    }

    if (home.baths) {
        about.numberOfBathroomsTotal = Number(home.baths)
    }

    if (home.sqft) {
        about.floorSize = {
            "@type": "QuantitativeValue",
            value: Number(home.sqft),
            unitCode: "FTK"
        }
    }

    if (typeof petsAllowed === "boolean") {
        about.petsAllowed = petsAllowed
    }

    const schema = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: home.marketingTitle || home.address,
        description: home.description || undefined,
        url,
        datePosted: home.lastSyncedAt || undefined,
        about,
        offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            availability: home.currentlyPosted
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            url: `${siteDomain}/rentals/`
        }
    }

    if (photos.length) {
        schema.image = photos
    }

    if (price) {
        schema.offers.price = price
    }

    // Drop undefined keys for cleaner JSON-LD
    if (!schema.description) {
        delete schema.description
    }
    if (!schema.datePosted) {
        delete schema.datePosted
    }

    return schema
}

module.exports = {
    eleventyComputed: {
        title: (data) => {
            if (!data.home || !data.home.address) {
                return "Home | SunSeeker Rentals"
            }
            return `${data.home.address} | SunSeeker Rentals`
        },
        description: (data) => {
            const fallback =
                "Property managed by SunSeeker Rentals. Browse current available rentals and apply online."
            const raw = (data.home && data.home.description) || fallback
            const cleaned = String(raw).replace(/\s+/g, " ").trim()
            return cleaned.length > 155 ? `${cleaned.slice(0, 152)}...` : cleaned
        },
        preloadImg: (data) => {
            if (data.home && data.home.photos && data.home.photos.length) {
                return data.home.photos[0]
            }
            return "/assets/images/cabinets2.webp"
        },
        listingSchema: (data) => {
            const domain =
                (data.client && data.client.domain) || "https://www.sunseekerrentals.com"
            const pageUrl = (data.page && data.page.url) || `/homes/${data.home && data.home.slug}/`
            return buildListingSchema(data.home, pageUrl, domain)
        }
    }
}
