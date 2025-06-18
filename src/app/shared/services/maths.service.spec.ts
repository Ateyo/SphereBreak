import { TestBed } from '@angular/core/testing';

import { MathsService } from './maths.service';

describe('MathsService', () => {
  let service: MathsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MathsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get coreSphere', () => {
    service.coreSphere = 5;
    expect(service.coreSphere).toBe(5);
  });

  it('should generate random int in range', () => {
    const min = 1, max = 5;
    const value = service.getRandomIntInclusive(min, max);
    expect(value).toBeGreaterThanOrEqual(min);
    expect(value).toBeLessThanOrEqual(max);
  });

  it('should calculate score correctly', () => {
    const score = service.calculateScore(2, 3);
    expect(score).toBe(2 * 10 + 3 * 50);
  });

  it('should update currentTotal and check for break', () => {
    spyOn(service, 'checkForBreak');
    service.makeAdditions([1, 2, 3]);
    expect(service.currentTotal()).toBe(6);
    expect(service.checkForBreak).toHaveBeenCalledWith(6);
  });

  it('should get next multiples', () => {
    service.coreSphere = 3;
    const multiples = service.getNextMultiples(5);
    expect(multiples.length).toBe(3);
    expect(multiples[0] % 3).toBe(0);
    expect(multiples[0]).toBeGreaterThan(5);
  });
});
