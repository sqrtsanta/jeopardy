export function copy(values: unknown) {
  if (values == null) {
    return values;
  } else if (Array.isArray(values)) {
    return values.slice();
  } else if (typeof values === "object") {
    return { ...values };
  } else {
    return values;
  }
}

