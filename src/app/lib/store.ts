export const PIZZA_FLAVORS = [
  'Pepperoni',
  'Margherita',
  'Bacon',
  'Vegetarian',
] as const;

export type PizzaFlavor = (typeof PIZZA_FLAVORS)[number];

export interface CategoryRating {
  criatividade: number;
  aparencia: number;
  sabor: number;
}

export interface Submission {
  id: string;
  flavor: PizzaFlavor | string;
  timestamp: string;
  reviews: Record<string, CategoryRating>;
}

// In-memory arrays storing submissions and distinct flavors that have submitted
export const submissionsStore: Submission[] = [];
export const completedFlavorsStore: Set<string> = new Set();

export interface DuoScoreResult {
  flavor: string;
  criatividadeAverage: number;
  aparenciaAverage: number;
  saborAverage: number;
  overallAverage: number;
  totalVotesCount: number;
}

export function calculateLeaderboard(): {
  leaderboard: DuoScoreResult[];
  winner: DuoScoreResult | null;
} {
  const FLAVORS = ['Pepperoni', 'Margherita', 'Bacon', 'Vegetarian'];

  const results: Record<string, { criatividade: number[]; aparencia: number[]; sabor: number[] }> = {};

  FLAVORS.forEach((flavor) => {
    results[flavor] = { criatividade: [], aparencia: [], sabor: [] };
  });

  // Aggregate scores from all submitted reviews
  submissionsStore.forEach((sub) => {
    Object.entries(sub.reviews).forEach(([flavor, rating]) => {
      if (results[flavor]) {
        if (rating.criatividade > 0) results[flavor].criatividade.push(rating.criatividade);
        if (rating.aparencia > 0) results[flavor].aparencia.push(rating.aparencia);
        if (rating.sabor > 0) results[flavor].sabor.push(rating.sabor);
      }
    });
  });

  const leaderboard: DuoScoreResult[] = FLAVORS.map((flavor) => {
    const scores = results[flavor];
    const cAvg = scores.criatividade.length
      ? scores.criatividade.reduce((a, b) => a + b, 0) / scores.criatividade.length
      : 0;
    const aAvg = scores.aparencia.length
      ? scores.aparencia.reduce((a, b) => a + b, 0) / scores.aparencia.length
      : 0;
    const sAvg = scores.sabor.length
      ? scores.sabor.reduce((a, b) => a + b, 0) / scores.sabor.length
      : 0;

    const overallAvg = (cAvg + aAvg + sAvg) / 3;

    return {
      flavor,
      criatividadeAverage: Number(cAvg.toFixed(2)),
      aparenciaAverage: Number(aAvg.toFixed(2)),
      saborAverage: Number(sAvg.toFixed(2)),
      overallAverage: Number(overallAvg.toFixed(2)),
      totalVotesCount: scores.sabor.length,
    };
  });

  // Sort by highest overall average score
  leaderboard.sort((a, b) => b.overallAverage - a.overallAverage);

  const winner = leaderboard.length > 0 && leaderboard[0].overallAverage > 0 ? leaderboard[0] : null;

  return { leaderboard, winner };
}