export type StandardOutput = (...args: any[]) => void;

export interface StandardStreams {
  output: StandardOutput;
}

export function createConsoleStandardStreams(): StandardStreams {
  return { output: console.log.bind(console) };
}
