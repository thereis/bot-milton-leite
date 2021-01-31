interface IWSMatchTeam {
  id: number;
  "short-name": string;
  name: string;
  slug: string;
  image: string;
  coach: {
    id: number;
    name: string;
    image: string;
  };
  color1: string;
  color2: string;
  tag: {
    name: string;
    id: number;
  };
}

export class WSMatch {
  id!: number;
  coverage!: number;
  date!: number;
  stadium!: string;
  championship!: {
    id: number;
    name: string;
    slug: string;
    season: number;
    tag: {
      id: number;
      name: string;
    };
    stage: {
      id: number;
      name: string;
      slug: string;
      classification: number;
    };
    group: {
      id: number;
      name: string;
      slug: string;
    };
  };

  teams!: {
    home: IWSMatchTeam;
    away: IWSMatchTeam;
  };
}
