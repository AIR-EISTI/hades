export class ServerInfo{
  name: string;
  nickname: string;
  status: string;
  command: string;
  args: Array<string>;
  stdout: Array<string>;
  exitCode: number;
  pid: number;
}

export class ServerList {
  [name: string]: ServerInfo
}
