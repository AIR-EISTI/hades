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
  
export class ServeurLauncher {
    nickname: string;
    game:string;
    vars:Object;
}