export interface IJeo {
  id: string;
  title: string;
  createdAt: number;
  categories: string[];
  questions: IQuestion[];
}

export interface IQuestion {
  question: string;
  answer: string;
  imageId?: string;
  audioId?: string;
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