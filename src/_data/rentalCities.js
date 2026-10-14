const homes = require("./homes.json");
const cities = require("./cities");
const { sortHomes } = require("../config/sortHomes");

function citySlug(city) {
    return String(city || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

const groups = new Map();

for (const [slug, city] of Object.entries(cities)) {
    if (!city || !city.name) continue;
    groups.set(slug, { slug, name: city.name, homes: [] });
}

for (const home of homes) {
    if (!home || !home.city || home.currentlyPosted !== true || !home.slug) continue;

    const slug = citySlug(home.city);
    const city = groups.get(slug);
    if (!city) continue;

    city.homes.push(home);
}

module.exports = Array.from(groups.values())
    .map((city) => ({
        ...city,
        homes: sortHomes(city.homes)
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
