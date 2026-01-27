const JapanModule = require("@svg-maps/japan");
const Japan = JapanModule.default || JapanModule;

const hokkaido = Japan.locations.find(l => l.id === "hokkaido");

if (hokkaido) {
    const d = hokkaido.path;
    console.log("Hokkaido Path Start:", d.substring(0, 100));
    // It seems parsing standard SVG path d is the only way to get bounds without a DOM.
    // I'll try to find min/max coordinates from the string by regex for numbers.
    // This is rough but might work for ViewBox estimation.

    const numbers = d.match(/[-+]?[0-9]*\.?[0-9]+/g).map(Number);
    // Note: 'd' commands are relative (m, l, c) or absolute (M, L, C).
    // If it uses relative commands after the first M, this simple number extraction is WRONG for bounds.
    // But @svg-maps/japan usually uses absolute coordinates or relative?
    // Let's check the first char.
    console.log("First char:", d[0]);
} else {
    console.log("Hokkaido not found");
}
