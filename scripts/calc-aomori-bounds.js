const JapanModule = require("@svg-maps/japan");
const Japan = JapanModule.default || JapanModule;
const aomori = Japan.locations.find(l => l.id === "aomori");
if (aomori) {
    console.log("Aomori Path Start:", aomori.path.substring(0, 100));
}
