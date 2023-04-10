// Capture elements
const button = document.querySelector("button");
const container = document.querySelector(".container");
const dimensionRangeInput = document.querySelector("#dimension-input");
const colorPicker = document.querySelector("#color-picker");

// Variables
let items = [];
let isMousePressed = false;
let color = "rgb(0,0,0)";
let opacity = 1;

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
    const item = document.createElement("span");
    item.classList.add("item");
    container.appendChild(item);
  }
  items = [...container.children];
  write();
}

// Select the color
colorPicker.addEventListener("input", function (e) {
  color = e.target.value;
});

// Verify if mouse button is pressed
container.addEventListener("mousedown", function () {
  isMousePressed = true;
});

container.addEventListener("mouseup", function () {
  isMousePressed = false;
});

// Color item
function write() {
  items.forEach((item) => {
    item.addEventListener("mouseover", function () {
      if (isMousePressed) {
        this.style.backgroundColor = color;
      }
    });
  });

  items.forEach((item) => {
    item.addEventListener("mousedown", function () {
      this.style.backgroundColor = color;
    });
  });
}

// Cancel color item
