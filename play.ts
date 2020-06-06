import { PlayProgram } from "./mod.ts";
import { DenoIo } from "./io.ts";

const program = new PlayProgram(new DenoIo());

program.run();
