import { TrainProgram } from "./mod.ts";
import { DenoIo } from "./io.ts";

const program = new TrainProgram(new DenoIo());

program.run();
