module.exports = {
    eleventyComputed: {
        title: (data) => {
            const city = data.rentalCity;
            if (!city || !city.name) {
                return "Houses for Rent | SunSeeker Rentals";
            }
            return `Houses for Rent in ${city.name}, AZ | SunSeeker Rentals`;
        },
        preloadImg: (data) => {
            const city = data.rentalCity;
            const firstHome = city && Array.isArray(city.homes) ? city.homes[0] : null;
            if (firstHome && Array.isArray(firstHome.photos) && firstHome.photos[0]) {
                return firstHome.photos[0];
            }
            return "";
        },
        description: (data) => {
            const city = data.rentalCity;
            if (!city || !city.name) {
                return "Current houses for rent from SunSeeker Rentals.";
            }
            const count = Array.isArray(city.homes) ? city.homes.length : 0;
            if (count === 0) {
                return `No houses are available for rent in ${city.name}, AZ right now. Browse current SunSeeker Rentals listings.`;
            }
            const homesLabel = count === 1 ? "house" : "houses";
            return `See ${count} ${homesLabel} for rent in ${city.name}, AZ. View rent, bedrooms, photos, and apply through SunSeeker Rentals.`;
        },
        itemListSchema: (data) => {
            const city = data.rentalCity;
            if (!city || !Array.isArray(city.homes) || city.homes.length === 0) {
                return null;
            }
            const domain =
                (data.client && data.client.domain) || "https://www.sunseekerrentals.com";
            return {
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: `Houses for Rent in ${city.name}, AZ`,
                numberOfItems: city.homes.length,
                itemListElement: city.homes.map((home, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: home.address,
                    url: `${domain}/homes/${home.slug}/`
                }))
            };
        }
    }
};
