/**
 * Represents a single highscore entry for a player.
 */
export interface Highscore {
  /**
   * Player initials (3 uppercase characters).
   */
  readonly initials: string;
  /**
   * Player's score (non-negative integer).
   */
  readonly score: number;
  /**
   * Level number (1-based).
   */
  readonly level: number;
}
