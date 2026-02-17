import { TestBed } from '@angular/core/testing';

import { ChatStrategyStore } from './chat-strategy-store';

describe('ChatStrategyStore', () => {
  let service: ChatStrategyStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatStrategyStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
