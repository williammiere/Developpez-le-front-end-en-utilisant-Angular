import { Participation } from './Participation';

export interface Olympic {
  id: string;
  country: string;
  participations: Participation[];
}
