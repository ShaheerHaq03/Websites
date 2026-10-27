export function generateUuids(
  count = 1,
  uppercase = false,
  randomUUID: () => string = () => crypto.randomUUID(),
) {
  if (!Number.isInteger(count) || count < 1 || count > 1000)
    throw new Error('Choose a whole number between 1 and 1,000.');
  return Array.from({ length: count }, () => {
    const value = randomUUID();
    return uppercase ? value.toUpperCase() : value;
  }).join('\n');
}
export function validateUuid(input: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    input.trim(),
  );
}
