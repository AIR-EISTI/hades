export class Variable {
    name: string;
    label: string;
    default: string;
}

export class Game {
    name: string;
    vars: Array<Variable>;
    command?: Array<string>;
}

export class GameList {
  [name: string]: Game;
}

export class Stat {
  cpu: number;
  memory: number;
  totalMemory: number;
}
