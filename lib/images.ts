export function absoluteImageUrl(value: string | null | undefined, requestUrl: string) {
  if (!value) return null;
  if (value.startsWith("/")) return new URL(value, requestUrl).toString();
  return value;
}
