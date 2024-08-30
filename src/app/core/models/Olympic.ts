import {Participation} from "./Participation";

export class Olympic {
  id: number;
  country: string;
  participations: Participation[];


  constructor(id: number, country: string, participations: Participation[]) {
    this.id = id;
    this.country = country;
    this.participations = participations;
  }
}
