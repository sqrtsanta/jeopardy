import { copy } from "./copy";

/*
 * set is pure function which changes value by path and return shallow copy of values
 * set will create new object and proceed further if there is no such key during traversing
 * set will NOT change value by path, if it encounters primitive value during traversing
 *
 * set("user.friends.0.name", "Name", values):
 * shallow copies values and asigns "Name" to values.users.friends[0].name
 */

export function set<T>(path: string | number, value: unknown, values: T): T {
  const root = copy(values);

  let keys: string[];

  if (typeof path === "string") {
    keys = path.split(".");
  } else {
    keys = [path.toString()];
  }
  let current = root;

  for (let i = 0; i < keys.length; i += 1) {
    if (current == null || typeof current !== "object") {
      break;
    }

    const key = keys[i];

    if (i === keys.length - 1) {
      (current as { [key: string]: unknown })[key] = value;
    } else {
      let childValues: unknown;
      childValues = copy((current as { [key: string]: unknown })[key]);

      if (childValues === undefined) {
        childValues = {};
      }

      (current as { [key: string]: unknown })[key] = childValues;
      current = childValues;
    }
  }

  return root as T;
}
