const JapanModule = require("@svg-maps/japan");
const Japan = JapanModule.default || JapanModule;
console.log("Keys:", Object.keys(Japan));
console.log("ViewBox:", Japan.viewBox);
console.log("Label:", Japan.label);
if (Japan.locations) {
    const okinawa = Japan.locations.find(l => l.id === "okinawa");
    console.log("Okinawa Path:", okinawa ? okinawa.path.substring(0, 100) + "..." : "Not Found");
} else {
    console.log("No locations found");
}
