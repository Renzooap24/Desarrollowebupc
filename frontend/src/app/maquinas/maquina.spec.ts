import { TestBed } from '@angular/core/testing';

import { Maquina } from './maquinas';

describe('Maquina', () => {
  let service: Maquina;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Maquina);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
