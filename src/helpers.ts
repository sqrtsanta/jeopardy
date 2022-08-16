import { type IJeo, type IQuestion, type ISize } from "./types";

export function price(size: ISize, question: IQuestion | null | undefined, questionIndex: number) {
  const defaultPrice = 200 * (Math.floor(questionIndex / size.cols) + 1);

  if (question && question.cost != null) {
    return Number(question.cost);
  }

  return defaultPrice
}

export function min(jeo: IJeo) {
  let toReturn = Infinity;

  for (let i = 0; i < jeo.questions.length; i += 1) {
    let current = price(size(jeo), jeo.questions[i], i);

    if (current < toReturn) {
      toReturn = current;
    }
  }

  if (toReturn === Infinity) {
    toReturn = 100;
  }

  return toReturn;
}

export function size(jeo: IJeo) {
  let cols = 6;
  let rows = 5;

  if (jeo.size && jeo.size.rows != null) {
    rows = Number(jeo.size.rows);
  }

  if (jeo.size && jeo.size.cols != null) {
    cols = Number(jeo.size.cols);
  }

  return {
    rows,
    cols,
  };
}