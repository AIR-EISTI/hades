export class Server{
  pid: string;
  name: string;
  status: string;
}

export class ServerInfo{
  name: string;
  nickname: string;
  status: string;
  command: string;
  args: Array<string>;
  stdout: Array<string>;
  exitCode: number;
}
