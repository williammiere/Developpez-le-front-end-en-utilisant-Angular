import { Participation } from './Participation';

export interface OlympicParticipant {
  id: string;
  country: string;
  participations: Participation[];
}
