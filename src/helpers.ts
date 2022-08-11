import { type IQuestion } from "./types";

export function price(question: IQuestion | null | undefined, questionIndex: number) {
  const defaultPrice = 200 * (Math.floor(questionIndex / 6) + 1);

  if (question && question.cost != null) {
    return Number(question.cost);
  }

  return defaultPrice
}