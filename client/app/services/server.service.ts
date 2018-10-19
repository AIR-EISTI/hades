import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ServerInfo, ServerList } from '../models/server';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private http: HttpClient) { }

  public getServerInfo(pid: Number): Observable<ServerInfo> {
    return this.http.get<ServerInfo>(`/api/servers/${pid}`)
  }

  public getServersList(): Observable<ServerList> {
    return this.http.get<ServerList>('/api/servers')
  }


  public stopServer(pid): Observable<any> {
    return this.http.delete(`/api/servers/${pid}`)
  }
}
