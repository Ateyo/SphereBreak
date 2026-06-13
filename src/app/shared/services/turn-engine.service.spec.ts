import { TestBed } from '@angular/core/testing';

import { TurnEngine } from './turn-engine.service';

describe('TurnEngine', () => {
  let engine: TurnEngine;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    engine = TestBed.inject(TurnEngine);
  });

  it('evaluateSelection computes total and nextMultiples', () => {
    engine.setCoreSphere(5);
    engine.evaluateSelection([2, 3]);
    expect(engine.currentTotal$()).toBe(5);
    expect(engine.nextMultiples$()).toEqual([5, 10, 15, 20, 25]);
  });

  it('detects break when total is a multiple of coreSphere', () => {
    engine.setCoreSphere(5);
    engine.evaluateSelection([2, 3]);
    expect(engine.break$()).toBeTrue();
  });

  it('does NOT detect break when total is 0', () => {
    engine.setCoreSphere(5);
    engine.evaluateSelection([]);
    expect(engine.break$()).toBeFalse();
    expect(engine.currentTotal$()).toBe(0);
  });

  it('does NOT detect break when total is not a multiple', () => {
    engine.setCoreSphere(5);
    engine.evaluateSelection([1, 2]);
    expect(engine.break$()).toBeFalse();
    expect(engine.currentTotal$()).toBe(3);
  });

  it('calculates score on break: 10pts per coin + 50pts per multiple', () => {
    engine.setCoreSphere(5);
    engine.evaluateSelection([5]);
    expect(engine.currentScore$()).toBe(10 * 1 + 50 * 1);
  });

  it('echo increments when same number of coins in consecutive breaks', () => {
    engine.setCoreSphere(2);
    engine.evaluateSelection([2]);
    expect(engine.break$()).toBeTrue();
    engine.advanceTurn();
    expect(engine.break$()).toBeFalse();
    engine.setCoreSphere(2);
    engine.evaluateSelection([2]);
    expect(engine.break$()).toBeTrue();
    expect(engine.echo$()).toBe(1);
  });

  it('advanceTurn increments turn', () => {
    engine.loadLevel(5, 20);
    expect(engine.turn$()).toBe(1);
    engine.advanceTurn();
    expect(engine.turn$()).toBe(2);
  });

  it('advanceTurn resets total and clears break flag', () => {
    engine.setCoreSphere(5);
    engine.evaluateSelection([2, 3]);
    expect(engine.break$()).toBeTrue();
    engine.advanceTurn();
    expect(engine.break$()).toBeFalse();
    expect(engine.currentTotal$()).toBe(0);
  });

  it('advanceTurn past turnLimit ends the game', () => {
    engine.loadLevel(1, 20);
    expect(engine.turn$()).toBe(1);
    engine.advanceTurn();
    expect(engine.turn$()).toBe(2);
    expect(engine.gameEnded$()).toBeTrue();
  });

  it('loadLevel sets turn and quota limits, resets state', () => {
    engine.setCoreSphere(5);
    engine.evaluateSelection([5]);
    engine.advanceTurn();
    expect(engine.turn$()).toBe(2);
    expect(engine.currentScore$()).toBeGreaterThan(0);

    engine.loadLevel(10, 50);
    expect(engine.turn$()).toBe(1);
    expect(engine.turnLimit$()).toBe(10);
    expect(engine.quotaLimit$()).toBe(50);
    expect(engine.currentScore$()).toBe(0);
    expect(engine.break$()).toBeFalse();
  });

  it('resetGame clears gameEnded flag', () => {
    engine.loadLevel(1, 20);
    engine.advanceTurn();
    expect(engine.gameEnded$()).toBeTrue();
    engine.resetGame();
    expect(engine.gameEnded$()).toBeFalse();
  });
});
