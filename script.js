// Capture elements
const brushColorPicker = document.querySelector("#brush-color");
const brushButton = document.getElementById("brush-button");
const eraseButton = document.getElementById("erase-button");
//const lightenButton = document.getElementById("lighten-button");
//const darkenButton = document.getElementById("darken-button");
const canvasColorPicker = document.getElementById("canvas-color");
const gridColorPicker = document.getElementById("grid-color");
const toggleGride = document.getElementById("toggle-grid");
const dimensionRangeInput = document.querySelector("#dimension-input");
const resolutionLabel = document.getElementById("resolution-label");
const resetButton = document.getElementById("reset-button");
const container = document.getElementById("grid-container");

// Variables
let isMousePressed = false;
let colorComponent = [0, 0, 0];
let activeMode = "brush";

// Initialize the page
generateGrid(32);

// Generate the grid
dimensionRangeInput.addEventListener("change", function (e) {
  let resolution = e.target.valueAsNumber;
  generateGrid(resolution);
  resolutionLabel.textContent = `${resolution} x ${resolution}`;
});

function generateGrid(e) {
  container.innerHTML = "";
  container.style.cssText = `grid-template-columns: repeat(${e},auto)`;
  for (let i = 0; i < e ** 2; i++) {
    const item = document.createElement("div");
    item.classList.add("item");
    item.addEventListener("mouseover", write);
    item.addEventListener("mousedown", write);
    container.appendChild(item);
  }
  activeMode = "brush";
}

// Verify if mouse button is pressed
document.body.addEventListener("mousedown", function () {
  isMousePressed = true;
});

document.body.addEventListener("mouseup", function () {
  isMousePressed = false;
});

// Select the color
brushColorPicker.addEventListener("input", function (e) {
  let color = e.target.value;
  colorComponent = color.hexToRGB();
  activeMode = "brush";
});

// Select mode
eraseButton.onclick = () => (activeMode = "erase");
brushButton.onclick = () => (activeMode = "brush");

// Brush and erase
function write(e) {
  if (e.type === "mouseover" && !isMousePressed) return;
  if (activeMode === "brush") {
    e.target.style.background = `rgb(${colorComponent[0]},${colorComponent[1]},${colorComponent[2]})`;
  } else if (activeMode === "erase") {
    e.target.style.backgroundColor = "transparent";
  }
}

// Grid and background settings
canvasColorPicker.addEventListener("input", function (e) {
  let color = e.target.value;
  container.style.backgroundColor = color;
});

gridColorPicker.addEventListener("input", function (e) {
  let color = e.target.value;
  let itemsList = Array.from(container.childNodes);
  itemsList.forEach((item) => (item.style.borderColor = color));
});

toggleGride.onclick = () => {
  let itemsList = Array.from(container.childNodes);
  itemsList.forEach((item) => item.classList.toggle("hide-grid"));
  if (toggleGride.textContent === "Hide grid") {
    toggleGride.textContent = "Show grid";
  } else {
    toggleGride.textContent = "Hide grid";
  }
};

// Reset
resetButton.onclick = () => {
  let itemsList = Array.from(container.childNodes);
  itemsList.forEach((item) => {
    item.style.backgroundColor = "transparent";
    item.style.opacity = 1;
    item.style.borderColor = "#999";
  });
  activeMode = "brush";
  container.style.backgroundColor = "white";
  resolutionLabel.textContent = "32 x 32";
};

// Other functions
String.prototype.hexToRGB = function () {
  var aRgbHex = this.slice(1).match(/.{1,2}/g);
  var colorComponent = [
    parseInt(aRgbHex[0], 16),
    parseInt(aRgbHex[1], 16),
    parseInt(aRgbHex[2], 16),
  ];
  return colorComponent;
};

// Da fare:
// - chiaro/scuro
// - colore casuale
// - modalità arcobaleno
// - Estetica range selettore
// - Stampa
// - Salva

// Dean Wagner per spunto
