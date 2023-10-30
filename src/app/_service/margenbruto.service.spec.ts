import { TestBed } from '@angular/core/testing';

import { MargenbrutoService } from './margenbruto.service';

describe('MargenbrutoService', () => {
  let service: MargenbrutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MargenbrutoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
