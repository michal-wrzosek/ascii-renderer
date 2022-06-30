import { BORDER_CHAR, EMPTY_CHAR } from "./config";
import { RenderInstruction } from "./types";

interface TextBoxProps {
  startRow: number;
  columns: number;
  margin: number;
  padding: number;
  text: string;
}

interface TextBoxReturn {
  instructions: readonly RenderInstruction[];
  nextRow: number;
}

export const textBox = ({ startRow, columns, margin, padding, text }: TextBoxProps): TextBoxReturn => {
  const instructions: RenderInstruction[] = [];
  let currentRow = startRow;
  const textLeft = text.split("");

  // top margin
  new Array(margin).fill(undefined).forEach(() => {
    new Array(columns).fill(undefined).forEach((_, column) => {
      instructions.push({ row: currentRow, column, character: EMPTY_CHAR });
    });

    currentRow++;
  });

  // top border
  new Array(columns).fill(undefined).forEach((_, column) => {
    if (column < margin) {
      instructions.push({ row: currentRow, column, character: EMPTY_CHAR });
    } else if (column > columns - margin - 1) {
      instructions.push({ row: currentRow, column, character: EMPTY_CHAR });
    } else {
      instructions.push({ row: currentRow, column, character: BORDER_CHAR });
    }
  });

  currentRow++;

  // top padding
  new Array(padding).fill(undefined).forEach(() => {
    new Array(columns).fill(undefined).forEach((_, column) => {
      if (column === margin) {
        instructions.push({ row: currentRow, column, character: BORDER_CHAR });
      } else if (column === columns - margin - 1) {
        instructions.push({ row: currentRow, column, character: BORDER_CHAR });
      } else {
        instructions.push({ row: currentRow, column, character: EMPTY_CHAR });
      }
    });

    currentRow++;
  });

  // body
  while (textLeft.length > 0) {
    new Array(columns).fill(undefined).forEach((_, column) => {
      // left margin
      if (column < margin) {
        instructions.push({ row: currentRow, column, character: EMPTY_CHAR });
        return;
      }

      // left border
      if (column === margin) {
        instructions.push({ row: currentRow, column, character: BORDER_CHAR });
        return;
      }

      // left padding
      if (column < margin + 1 + padding) {
        instructions.push({ row: currentRow, column, character: EMPTY_CHAR });
        return;
      }

      // text
      if (column < columns - margin - 1 - padding) {
        const character = textLeft.shift();
        instructions.push({ row: currentRow, column, character: character ?? EMPTY_CHAR });
        return;
      }

      // right padding
      if (column < columns - margin - 1) {
        instructions.push({ row: currentRow, column, character: EMPTY_CHAR });
        return;
      }

      // right border
      if (column === columns - margin - 1) {
        instructions.push({ row: currentRow, column, character: BORDER_CHAR });
        return;
      }

      // right margin
      if (column > columns - margin - 1) {
        instructions.push({ row: currentRow, column, character: EMPTY_CHAR });
        return;
      }
    });

    currentRow++;
  }

  // bottom padding
  new Array(padding).fill(undefined).forEach(() => {
    new Array(columns).fill(undefined).forEach((_, column) => {
      if (column === margin) {
        instructions.push({ row: currentRow, column, character: BORDER_CHAR });
      } else if (column === columns - margin - 1) {
        instructions.push({ row: currentRow, column, character: BORDER_CHAR });
      } else {
        instructions.push({ row: currentRow, column, character: EMPTY_CHAR });
      }
    });

    currentRow++;
  });

  // bottom border
  new Array(columns).fill(undefined).forEach((_, column) => {
    if (column < margin) {
      instructions.push({ row: currentRow, column, character: EMPTY_CHAR });
    } else if (column > columns - margin - 1) {
      instructions.push({ row: currentRow, column, character: EMPTY_CHAR });
    } else {
      instructions.push({ row: currentRow, column, character: BORDER_CHAR });
    }
  });

  currentRow++;

  // bottom margin
  new Array(margin).fill(undefined).forEach(() => {
    new Array(columns).fill(undefined).forEach((_, column) => {
      instructions.push({ row: currentRow, column, character: EMPTY_CHAR });
    });

    currentRow++;
  });

  return { instructions, nextRow: currentRow };
};
