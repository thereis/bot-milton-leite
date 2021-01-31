export class Team {
  id!: number;
  "nome-completo": string;
  "nome-comum": string;
  "nome-slug": string;
  sigla!: string;
  tipo!: string;
  brasao!: string;

  constructor(params: Partial<Team>) {
    Object.assign(this, params);
  }
}
