import { pixels } from "./pixels";
import { renderSubject } from "./render-subject";
import { RenderInstruction } from "./types";

export const renderInstructions = (instructions: readonly RenderInstruction[]): void => {
  instructions.forEach(({ row, column, character }) => {
    pixels[`${row}-${column}`] = character;
    renderSubject.next([row, column]);
  });
};
