// Capture elements
const container = document.querySelector(".container");
const dimensionRangeInput = document.querySelector("#dimension-input");
const colorPicker = document.querySelector("#color-picker");
const brushButton = document.getElementById("brush-button");
const bgColorButton = document.getElementById("bg-color");
const eraseButton = document.getElementById("erase-button");
const toggleGride = document.getElementById("toggle-grid");
const cancelButton = document.getElementById("cancel-button");

// Variables
let isMousePressed = false;
let colorComponent = [0, 0, 0];
let opacity = 1;
let activeMode = "brush";

// Initialize the page
generateGrid(32);

// Generate the grid
dimensionRangeInput.addEventListener("input", function (e) {
  generateGrid(e.target.valueAsNumber);
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
colorPicker.addEventListener("input", function (e) {
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
    e.target.style.backgroundColor = `rgba(${colorComponent[0]},${colorComponent[1]},${colorComponent[2]},${opacity})`;
  } else if (activeMode === "erase") {
    e.target.style.backgroundColor = "transparent";
  }
}

// Color the background
bgColorButton.onclick = () =>
  (container.style.backgroundColor = `rgb(${colorComponent[0]},${colorComponent[1]},${colorComponent[2]}`);

// Show/hide grid
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
cancelButton.onclick = () => {
  let itemsList = Array.from(container.childNodes);
  itemsList.forEach((item) => (item.style.backgroundColor = "transparent"));
  activeMode = "brush";
  container.style.backgroundColor = "white";
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
// - selettore opacità
// - colore casuale
// - modalità arcobaleno
// - Estetica
