import { Participation } from './Participation';

/**
 * Represents a participating country to the olympic games.
 */
export interface OlympicParticipant {
  id: string;

  /**
   * Name of the participating country
   */
  country: string;

  /**
   * List of the country participations:
   */
  participations: Participation[];
}
