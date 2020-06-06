export interface Io {
  prompt(val: string): Promise<string>;
  log(...args: (string | number)[]): void;
  readJsonSync<T>(path: string): T;
  writeJsonSync(path: string, value: unknown): void;
}
