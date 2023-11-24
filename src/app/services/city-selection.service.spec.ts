import { TestBed } from '@angular/core/testing';

import { CitySelectionService } from './city-selection.service';

describe('CitySelectionService', () => {
  let service: CitySelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitySelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
