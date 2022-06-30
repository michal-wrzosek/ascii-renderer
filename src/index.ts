/* eslint-disable prefer-const */
import { of } from "rxjs";
import { concatMap, delay } from "rxjs/operators";

import "./index.css";
import { pixels } from "./pixels";
import { renderInstructions } from "./render-instructions";
import { renderSubject } from "./render-subject";
import { textBox } from "./text-box";

const PIXEL_SIZE_PX = 12;
const PREFIX = "ascii-renderer";
const CONTAINER_ID = `${PREFIX}-container`;
const CONTAINER_CLASS = `${PREFIX}-container`;
const PIXEL_CLASS = `${PREFIX}-pixel`;

const appEl = document.getElementById("app");
if (!appEl) throw new Error("Element not found");

appEl.innerHTML = `
  <div id="${CONTAINER_ID}" class="${CONTAINER_CLASS}"></div>
`;

const containerEl = document.getElementById(CONTAINER_ID);
if (!containerEl) throw new Error("Element not found");

let { width, height } = containerEl.getBoundingClientRect();

let columns = Math.floor(width / PIXEL_SIZE_PX);
let rows = Math.floor(height / PIXEL_SIZE_PX);

let coordinates: [number, number][] = [];

for (let row = 0; row < rows; row++) {
  for (let column = 0; column < columns; column++) {
    coordinates.push([row, column]);
  }
}

for (let row = 0; row < rows; row++) {
  for (let column = 0; column < columns; column++) {
    pixels[`${row}-${column}`] = " ";
  }
}

const spanEl = document.createElement("span");
const pixelsFragment = document.createDocumentFragment();
coordinates.forEach(([row, column]) => {
  const cloneSpanEl = spanEl.cloneNode(true) as HTMLSpanElement;
  cloneSpanEl.id = `${PREFIX}-pixel-${row}-${column}`;
  cloneSpanEl.className = PIXEL_CLASS;
  cloneSpanEl.innerText = pixels[`${row}-${column}`];
  pixelsFragment.appendChild(cloneSpanEl);
});
containerEl.appendChild(pixelsFragment);

const pixelEls = containerEl.childNodes;

let mouseRow: number | undefined = undefined;
let mouseColumn: number | undefined = undefined;

const onMouseMove = (event: MouseEvent) => {
  const { x, y } = event;
  const newMouseRow = Math.floor(y / PIXEL_SIZE_PX);
  const newMouseColumn = Math.floor(x / PIXEL_SIZE_PX);

  if (newMouseRow !== mouseRow || newMouseColumn !== mouseColumn) {
    if (mouseRow !== undefined && mouseColumn !== undefined) {
      // const pixel = document.getElementById(`${PREFIX}-pixel-${mouseRow}-${mouseColumn}`);
      const pixel = pixelEls[mouseRow * columns + mouseColumn];
      if (pixel) pixel.textContent = pixels[`${mouseRow}-${mouseColumn}`];
    }

    if (newMouseRow !== undefined && newMouseColumn !== undefined) {
      // const pixel = document.getElementById(`${PREFIX}-pixel-${newMouseRow}-${newMouseColumn}`);
      const pixel = pixelEls[newMouseRow * columns + newMouseColumn];
      if (pixel) pixel.textContent = "X";
    }

    mouseRow = newMouseRow;
    mouseColumn = newMouseColumn;
  }
};

containerEl.addEventListener("mousemove", onMouseMove);

renderSubject.pipe(concatMap((value) => of(value).pipe(delay(1)))).subscribe(([row, column]) => {
  const pixelEl = pixelEls[row * columns + column];
  const pixelState = pixels[`${row}-${column}`];
  if (pixelEl && pixelState !== undefined) pixelEl.textContent = pixelState;
});

let currentRow = 0;

// Header
const header = textBox({
  startRow: currentRow,
  columns,
  margin: 2,
  padding: 2,
  text: "This is some silly ASCII renderer",
});

currentRow = header.nextRow;
renderInstructions(header.instructions);

// Lorem Ipsum
const loremIpsum = textBox({
  startRow: currentRow,
  columns,
  margin: 2,
  padding: 2,
  text:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi lacus metus, dapibus a malesuada quis, gravida nec erat. Cras pharetra nunc eu quam feugiat, nec congue mauris euismod. Mauris non augue sollicitudin, venenatis sem in, mollis sapien. Curabitur a faucibus enim. Maecenas eleifend convallis erat, sit amet luctus eros elementum sed. Nulla porttitor tempor tellus, eu ornare mi dapibus at. Aliquam eleifend suscipit mattis. In vel mi euismod, imperdiet odio at, elementum lorem. Quisque nec velit a orci varius volutpat. Aliquam id turpis rutrum, mollis lectus nec, posuere orci. Etiam ultrices lorem luctus nisl ultricies ultricies. Proin efficitur eros sit amet congue semper. Mauris at interdum turpis, in porta ante.",
});

currentRow = loremIpsum.nextRow;
renderInstructions(loremIpsum.instructions);
