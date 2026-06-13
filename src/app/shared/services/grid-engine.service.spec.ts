import { TestBed } from '@angular/core/testing';
import { TurnEngine } from './turn-engine.service';
import { GridEngine } from './grid-engine.service';

describe('GridEngine', () => {
  let engine: GridEngine;
  let turnEngine: TurnEngine;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    engine = TestBed.inject(GridEngine);
    turnEngine = TestBed.inject(TurnEngine);
  });

  it('addEntryCoin adds a coin to entryCoinsArray', () => {
    engine.addEntryCoin(5);
    expect(engine.entryCoinsArray$().length).toBe(1);
    expect(engine.entryCoinsArray$()[0].coin.value).toBe(5);
  });

  it('removeEntryCoin removes the coin with matching id', () => {
    engine.addEntryCoin(5);
    engine.addEntryCoin(3);
    const id = engine.entryCoinsArray$()[0].id;
    engine.removeEntryCoin(id);
    expect(engine.entryCoinsArray$().length).toBe(1);
    expect(engine.entryCoinsArray$()[0].coin.value).toBe(3);
  });

  it('selectCoin adds an entry coin to selection when allowed', () => {
    turnEngine.setCoreSphere(2);
    engine.makeGrid([{ value: 2, entryCoin: true }], []);
    engine.selectCoin(1);
    expect(engine.selectedCoins$().length).toBe(1);
    expect(engine.selectedCoins$()[0].value).toBe(2);
  });

  it('selectCoin rejects border coin when no entry coin selected', () => {
    turnEngine.setCoreSphere(2);
    engine.makeGrid([{ value: 2, entryCoin: true }], [{ value: 3, entryCoin: false }]);
    engine.selectCoin(101);
    expect(engine.selectedCoins$().length).toBe(0);
  });

  it('selectCoin allows border coin after entry coin selected', () => {
    turnEngine.setCoreSphere(2);
    engine.makeGrid([{ value: 2, entryCoin: true }], [{ value: 4, entryCoin: false }]);
    engine.selectCoin(1);
    engine.selectCoin(101);
    expect(engine.selectedCoins$().length).toBe(2);
  });

  it('selectCoin rejects duplicate selection', () => {
    turnEngine.setCoreSphere(2);
    engine.makeGrid([{ value: 2, entryCoin: true }], []);
    engine.selectCoin(1);
    engine.selectCoin(1);
    expect(engine.selectedCoins$().length).toBe(1);
  });

  it('confirmBreak increments levelQuota by border coins used', () => {
    turnEngine.setCoreSphere(2);
    engine.makeGrid([{ value: 2, entryCoin: true }], [{ value: 4, entryCoin: false }]);
    engine.selectCoin(1);
    engine.selectCoin(101);
    expect(turnEngine.break$()).toBeTrue();

    engine.confirmBreak();
    expect(engine.levelQuota$()).toBe(1);
  });

  it('reset clears quota, selection, and game state', () => {
    engine.reset();
    expect(engine.levelQuota$()).toBe(0);
    expect(engine.selectedCoins$().length).toBe(0);
  });

  it('isValidSelection returns false for non-existent coin', () => {
    turnEngine.setCoreSphere(2);
    engine.makeGrid([{ value: 2, entryCoin: true }], [{ value: 4, entryCoin: false }]);
    expect(engine.isValidSelection(999)).toBeFalse();
  });

  it('isValidSelection returns true for selectable entry coin', () => {
    turnEngine.setCoreSphere(2);
    engine.makeGrid([{ value: 2, entryCoin: true }], []);
    expect(engine.isValidSelection(1)).toBeTrue();
  });

  it('isValidSelection returns false for border coin without entry coin selected', () => {
    turnEngine.setCoreSphere(2);
    engine.makeGrid([{ value: 2, entryCoin: true }], [{ value: 4, entryCoin: false }]);
    expect(engine.isValidSelection(101)).toBeFalse();
  });

  it('isValidSelection returns true for border coin after entry coin selected', () => {
    turnEngine.setCoreSphere(2);
    engine.makeGrid([{ value: 2, entryCoin: true }], [{ value: 4, entryCoin: false }]);
    engine.selectCoin(1);
    expect(engine.isValidSelection(101)).toBeTrue();
  });

  it('isValidSelection returns false for already selected coin', () => {
    turnEngine.setCoreSphere(2);
    engine.makeGrid([{ value: 2, entryCoin: true }], []);
    engine.selectCoin(1);
    expect(engine.isValidSelection(1)).toBeFalse();
  });

  it('startNewTurn clears selection', () => {
    turnEngine.setCoreSphere(2);
    engine.makeGrid([{ value: 2, entryCoin: true }], []);
    engine.selectCoin(1);
    expect(engine.selectedCoins$().length).toBe(1);

    engine.startNewTurn();
    expect(engine.selectedCoins$().length).toBe(0);
  });

  it('regenerates zeroed border coins after 3 turns', () => {
    turnEngine.setCoreSphere(2);
    engine.makeGrid([{ value: 2, entryCoin: true }], [{ value: 4, entryCoin: false }]);
    engine.selectCoin(1);
    engine.selectCoin(101);
    engine.confirmBreak();
    expect(engine.coinsArray$()[0].coin.value).toBe(0);

    engine.startNewTurn();
    engine.startNewTurn();
    engine.startNewTurn();
    expect(engine.coinsArray$()[0].coin.value).toBeGreaterThan(0);
  });
});
