interface TeamLineUp {
  id: number;
  name: string;
  "initial-state": number;
  image: string;
}

export class LineUp {
  home!: TeamLineUp[];
  away!: TeamLineUp[];
}
