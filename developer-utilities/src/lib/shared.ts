export const MAX_BYTES = 1_000_000;
export function bounded(input: string) {
  if (new TextEncoder().encode(input).length > MAX_BYTES)
    throw new Error(
      'Input exceeds the 1 MB limit. Reduce the file or process a smaller sample.',
    );
}
export function required(input: string) {
  bounded(input);
  if (!input.trim()) throw new Error('Enter some input first.');
}
export type Json =
  null | boolean | number | string | Json[] | { [key: string]: Json };
export type TaskResult = {
  output: string;
  message?: string;
  warnings?: string[];
  table?: string[][];
  changes?: Change[];
  matches?: RegexMatch[];
  parameters?: [string, string][];
  urlBase?: string;
};
export type Change = {
  type: 'added' | 'removed' | 'changed';
  path: string;
  before?: Json;
  after?: Json;
};
export type RegexMatch = {
  value: string;
  index: number;
  groups: (string | undefined)[];
  named: Record<string, string | undefined>;
};
export type Task = {
  kind: string;
  input: string;
  second?: string;
  options?: Record<string, string | number | boolean>;
};
