export interface Coin {
  value: number;
  entryCoin: boolean;
  readonly id?: number; // Optional for backward compatibility
}
