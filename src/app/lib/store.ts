export const REVIEWER_DUO_MAP: Record<string, string> = {
  Muri: 'Muri e Leo',
  Leo: 'Muri e Leo',
  Carol: 'Carol e Gabriel',
  Gabriel: 'Carol e Gabriel',
  Lu: 'Lu e Thiago',
  Thiago: 'Lu e Thiago',
  Andres: 'Andres e Nicolas',
  Nicolas: 'Andres e Nicolas',
  Henrique: 'Henrique e Pedro',
  Pedro: 'Henrique e Pedro',
};

export const REVIEWERS = [
  'Muri',
  'Leo',
  'Carol',
  'Gabriel',
  'Lu',
  'Thiago',
  'Andres',
  'Nicolas',
  'Henrique',
  'Pedro',
] as const;

export type ReviewerName = (typeof REVIEWERS)[number];

export interface CategoryRating {
  criatividade: number;
  aparencia: number;
  sabor: number;
}

export interface Submission {
  id: string;
  reviewer: ReviewerName | string;
  timestamp: string;
  reviews: Record<string, CategoryRating>;
}

// In-memory arrays storing submissions and distinct reviewers who have submitted
export const submissionsStore: Submission[] = [];
export const completedReviewersStore: Set<string> = new Set();

export interface DuoScoreResult {
  duo: string;
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
  const PAIRS = [
    'Muri e Leo',
    'Carol e Gabriel',
    'Lu e Thiago',
    'Andres e Nicolas',
    'Henrique e Pedro',
  ];

  const results: Record<string, { criatividade: number[]; aparencia: number[]; sabor: number[] }> = {};

  PAIRS.forEach((pair) => {
    results[pair] = { criatividade: [], aparencia: [], sabor: [] };
  });

  // Aggregate scores from all submitted reviews
  submissionsStore.forEach((sub) => {
    Object.entries(sub.reviews).forEach(([pair, rating]) => {
      if (results[pair]) {
        if (rating.criatividade > 0) results[pair].criatividade.push(rating.criatividade);
        if (rating.aparencia > 0) results[pair].aparencia.push(rating.aparencia);
        if (rating.sabor > 0) results[pair].sabor.push(rating.sabor);
      }
    });
  });

  const leaderboard: DuoScoreResult[] = PAIRS.map((pair) => {
    const scores = results[pair];
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
      duo: pair,
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