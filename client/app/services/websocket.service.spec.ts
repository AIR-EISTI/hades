import { TestBed } from '@angular/core/testing';

import { WebSocketService } from './websocket.service';

describe('ConsoleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebSocketService = TestBed.get(WebSocketService);
    expect(service).toBeTruthy();
  });
});
