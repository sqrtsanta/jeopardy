export function get(path: string, values: unknown): unknown | null {
  const keys = path.split(".");

  let current = values;

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];

    if (current == null || typeof current !== "object" || !(key in current)) {
      return null;
    }

    const childValues = (current as { [key: string]: unknown })[key];
    current = childValues;
  }

  return current;
}
