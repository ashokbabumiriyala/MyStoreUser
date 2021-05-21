import { TestBed } from '@angular/core/testing';

import { CategorySearchService } from './category-search.service';

describe('CategorySearchService', () => {
  let service: CategorySearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorySearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
