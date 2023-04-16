// Capture elements
const buttons = document.querySelectorAll("button");
const brushColorPicker = document.querySelector("#brush-color");
const brushButton = document.getElementById("brush-button");
const brushOpacityInput = document.getElementById("opacity-input");
const brushMoistureInput = document.getElementById("moisture-input");
const wetBrushButton = document.getElementById("wet-brush-button");
const eraseButton = document.getElementById("erase-button");
const rainbowButton = document.getElementById("rainbow-button");
const canvasColorPicker = document.getElementById("canvas-color");
const gridColorPicker = document.getElementById("grid-color");
const toggleGride = document.getElementById("toggle-grid");
const dimensionRangeInput = document.querySelector("#dimension-input");
const resolutionLabel = document.getElementById("resolution-label");
const resetButton = document.getElementById("reset-button");
const container = document.getElementById("grid-container");

// Variables
let isMousePressed = false;
let activeMode = "brush";
let colorComponent = [0, 0, 0, brushOpacityInput.valueAsNumber / 100];
let aaa = 1;

// Initialize the page
generateGrid(32);

// Generate the grid
dimensionRangeInput.addEventListener("input", function (e) {
  let resolution = e.target.valueAsNumber;
  generateGrid(resolution);
  resolutionLabel.textContent = `Grid size: ${resolution} x ${resolution}`;
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
});

// Select mode
brushButton.onclick = () => {
  removeActiveClass();
  activeMode = "brush";
  brushButton.classList.add("active");
};

eraseButton.onclick = () => {
  removeActiveClass();
  activeMode = "erase";
  eraseButton.classList.add("active");
};

wetBrushButton.onclick = () => {
  removeActiveClass();
  activeMode = "wetbrush";
  wetBrushButton.classList.add("active");
};

rainbowButton.onclick = () => {
  removeActiveClass();
  activeMode = "rainbow";
  rainbowButton.classList.add("active");
};

function removeActiveClass() {
  buttons.forEach((btn) => btn.classList.remove("active"));
}

// Brush and erase
function write(e) {
  if (e.type === "mouseover" && !isMousePressed) return;
  if (activeMode === "brush") {
    if (e.target.style.backgroundColor === "") {
      e.target.style.backgroundColor = `rgba(${colorComponent[0]},${
        colorComponent[1]
      },${colorComponent[2]},${brushOpacityInput.valueAsNumber / 100})`;
    } else {
      let finalColor = calcNewColor(
        e.target.style.backgroundColor,
        `rgba(${colorComponent[0]},${colorComponent[1]},${colorComponent[2]},${
          brushOpacityInput.valueAsNumber / 100
        })`
      );
      e.target.style.backgroundColor = `rgba(${finalColor[0]},${finalColor[1]},${finalColor[2]},${finalColor[3]})`;
    }
  } else if (activeMode === "wetbrush") {
    if (
      e.target.style.backgroundColor === "" ||
      extractColorValue(e.target.style.backgroundColor)[3] === 0
    ) {
      let opacityDecrement = calcMoisture();

      e.target.style.backgroundColor = `rgba(${colorComponent[0]},${colorComponent[1]},${colorComponent[2]},
            ${aaa}`;

      aaa -= 0.1;
      document.body.addEventListener("mouseup", () => (aaa = 1));
    }
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
resetButton.onclick = reset;

function reset() {
  generateGrid(32);
  removeActiveClass();
  activeMode = "brush";
  brushButton.classList.add("active");
  container.style.backgroundColor = "white";
  resolutionLabel.textContent = "Grid size: 32 x 32";
  dimensionRangeInput.value = 32;
  brushColorPicker.value = "#000000";
  canvasColorPicker.value = "#ffffff";
  gridColorPicker.value = "#999999";
  colorComponent = [0, 0, 0, 1];
  brushOpacityInput.value = 100;
  brushMoistureInput.value = 100;
}

// Other functions
String.prototype.hexToRGB = function () {
  let aRgbHex = this.slice(1).match(/.{1,2}/g);
  let colorComponent = [
    parseInt(aRgbHex[0], 16),
    parseInt(aRgbHex[1], 16),
    parseInt(aRgbHex[2], 16),
  ];
  return colorComponent;
};

function calcNewColor(c1, c2) {
  let color1Value = extractColorValue(c1);
  let color2Value = extractColorValue(c2);
  let newAlpha = Number(
    (color2Value[3] + color1Value[3] * (1 - color2Value[3])).toFixed(2)
  );
  let newColorComponent = [];

  for (let i = 0; i < 3; i++) {
    newColorComponent.push(
      Math.round(
        (color2Value[i] * color2Value[3] +
          color1Value[i] * color1Value[3] * (1 - color2Value[3])) /
          newAlpha
      )
    );
  }
  newColorComponent.push(newAlpha);
  return newColorComponent;
}

function calcMoisture() {
  let moisture = brushMoistureInput.valueAsNumber;
  let opacityDecrement;
  if (moisture !== 100) {
    opacityDecrement = 0.8;
  } else opacityDecrement = 0;
  //console.log(opacityDecrement);
  return opacityDecrement;
}

function extractColorValue(color) {
  let rgbString = color.replace(/^rgba?\(|\s+|\)$/g, "").split(",");
  let rgb = [];

  if (rgbString[0] !== "") {
    if (rgbString.length === 3) {
      rgbString.push("1"); //impose the presence of the alpha channel
    }
    for (let i = 0; i < 4; i++) {
      rgb.push(Number(rgbString[i]));
    }
  }
  return rgb;
}

// Da fare:
// - calcolo decremento opacità
// - modalità arcobaleno
// - Icona pennello/gomma
// - Stampa
// - Salva

// Dean Wagner per spunto
