/**
 * Sort property listings A–Z by street name, then house number.
 * "12523 W Estero Ln, ..." → key "w estero ln"
 */
function streetSortKey(address) {
    const line = String(address || "")
        .split(",")[0]
        .trim()
    return line
        .replace(/^\d+\S*\s+/, "")
        .replace(/\./g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase()
}

function compareHomeAddresses(a, b) {
    const byStreet = streetSortKey(a).localeCompare(streetSortKey(b), undefined, {
        sensitivity: "base",
        numeric: true
    })
    if (byStreet !== 0) {
        return byStreet
    }
    return String(a).localeCompare(String(b), undefined, {
        sensitivity: "base",
        numeric: true
    })
}

function sortHomes(homes) {
    if (!Array.isArray(homes)) {
        return homes
    }
    return [...homes].sort((a, b) =>
        compareHomeAddresses(a && a.address, b && b.address)
    )
}

module.exports = {
    sortHomes,
    compareHomeAddresses,
    streetSortKey
}
