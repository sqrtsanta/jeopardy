import { type IJeo, type IQuestion, type ISize } from "./types";

export function price(size: ISize, question: IQuestion | null | undefined, questionIndex: number) {
  const defaultPrice = 200 * (Math.floor(questionIndex / size.cols) + 1);

  if (question && question.cost != null) {
    return Number(question.cost);
  }

  return defaultPrice
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