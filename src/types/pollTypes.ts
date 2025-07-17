export interface Poll {
  question: string;
  options: string[];
  answers: Record<string, number>;
  active: boolean;
  startTime: number;
  duration: number;
}
