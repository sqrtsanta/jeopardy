export interface IJeo {
  id: string;
  title: string;
  createdAt: number;
  categories: string[];
  questions: IQuestion[];
  size?: {
    rows: number;
    cols: number;
  }
}

export interface IQuestion {
  question: string;
  answer: string;
  imageId?: string;
  audioId?: string;
  cost?: number;
}

export interface IPlayer {
  name: string;
  score: IScore;
}

export interface IScore {
  correct: number;
  $: number;
  incorrect: number;
}

export enum IMode {
  Play,
  Build,
}