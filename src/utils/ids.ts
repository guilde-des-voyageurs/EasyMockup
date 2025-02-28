let counter = 0;

export function generateTempId(prefix: string = 'temp'): string {
  counter += 1;
  return `${prefix}-${counter}`;
}
