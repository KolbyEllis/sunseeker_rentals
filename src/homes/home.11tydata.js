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
        }
    }
}
