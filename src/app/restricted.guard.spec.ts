import { TestBed } from '@angular/core/testing';

import { RestrictedGuard } from './restricted.guard';

describe('RestrictedGuard', () => {
  let guard: RestrictedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RestrictedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
