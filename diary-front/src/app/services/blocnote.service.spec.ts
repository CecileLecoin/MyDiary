import { TestBed } from '@angular/core/testing';

import { BlocnoteService } from './blocnote.service';

describe('BlocnoteService', () => {
  let service: BlocnoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlocnoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
