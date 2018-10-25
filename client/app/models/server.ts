export class ServerInfo{
  name: string;
  nickname: string;
  status: string;
  command: string;
  args: Array<string>;
  stdout: Array<string>;
  exitCode: number;
  pid: number;
  statsHist: Stat[];
}

export class ServerList {
  [name: string]: ServerInfo
}

export class ServerForm {
    nickname: string;
    game: string;
    vars: {[name: string]: string};
}

export class Stat {
  cpu: number;
  memory: number;
  totalMemory: number;
}
