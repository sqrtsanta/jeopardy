export function price(questionIndex: number) {
  return 200 * (Math.floor(questionIndex / 6) + 1);
}