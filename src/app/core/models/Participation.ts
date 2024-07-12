// TODO: create here a typescript interface for a participation
/*
example of participation:
{
    id: 1,
    year: 2012,
    city: "Londres",
    medalsCount: 28,
    athleteCount: 372
}
*/
export class Participation {
  id: string;
  constructor(
    public year: number,
    public city: string,
    public medalsCount: number,
    public athleteCount: number
  ) {
    this.id = crypto.randomUUID().substring(0, 8);
  }
}
