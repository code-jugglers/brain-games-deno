import {
  readJsonSync,
  writeJsonSync,
} from "https://deno.land/std@0.55.0/fs/mod.ts";

import { Io } from "./mod.ts";

export class DenoIo implements Io {
  private decoder = new TextDecoder();

  async prompt(value: string) {
    await Deno.stdout.write(new TextEncoder().encode(value));

    const buf = new Uint8Array(1024);
    const n = <number>await Deno.stdin.read(buf);

    return this.decoder.decode(buf.subarray(0, n)).toUpperCase().trim();
  }

  log(...args: any[]) {
    console.log.apply(console, args);
  }

  readJsonSync<T>(path: string) {
    return readJsonSync(path) as T;
  }

  writeJsonSync(path: string, value: unknown) {
    writeJsonSync(path, value);
  }
}
