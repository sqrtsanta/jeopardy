export function clsx(...list: Array<string | boolean | undefined | null>) {
  return list.filter((item) => typeof item === "string").join(" ");
}