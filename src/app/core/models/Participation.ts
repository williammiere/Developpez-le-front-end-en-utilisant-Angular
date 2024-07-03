/**
 * Represents a participation to the olympic games.
 */
export interface Participation {
  id: string;

  /**
   * The year of the participation.
   */
  year: string;

  /**
   * The city where participation took place.
   */
  city: string;

  /**
   * The number of medals earned by the participant
   * for this participation.
   */
  medalsCount: number;

  /**
   * The number of athletes who participated.
   */
  athleteCount: number;
}
