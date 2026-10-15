/** Flattens a nested object into Mongo dot-paths so partial updates don't wipe sibling fields. */
export function toDotPaths(obj: Record<string, unknown>, prefix = ""): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      Object.assign(out, toDotPaths(value as Record<string, unknown>, path));
    } else {
      out[path] = value;
    }
  }
  return out;
}
