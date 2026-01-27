const JapanModule = require("@svg-maps/japan");
const Japan = JapanModule.default || JapanModule;

const okinawa = Japan.locations.find(l => l.id === "okinawa");

if (okinawa) {
    const d = okinawa.path;
    // Regex to find all numbers. This assumes absolute coordinates mostly or at least keys on the values present.
    // SVG paths can be relative lowercase 'm', 'l'.
    // However, looking at the previous output "m 82.159926,466.98889 0.83,-0.81", it seems relative.
    // Making a full parser is hard.
    // But the initial 'm' sets the start point.
    // m 82.159926,466.98889
    // That means the first point is (82.16, 466.99).
    // Let's assume the map is constructed such that islands are clustered.
    // The previous viewBox was "72 462 46 46".
    // x range: 72 to 118.
    // y range: 462 to 508.

    // I can try to parse it properly or just dump more of the path to see.
    console.log("Path Start:", d.substring(0, 500));
} else {
    console.log("Okinawa not found");
}
