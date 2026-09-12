
import { NextResponse } from 'next/server';
import {
  submissionsStore,
  completedReviewersStore,
  REVIEWERS,
  calculateLeaderboard,
} from '../../lib/store';

export async function GET() {
  const completedList = Array.from(completedReviewersStore);
  const pendingList = REVIEWERS.filter((name) => !completedReviewersStore.has(name));
  const { leaderboard, winner } = calculateLeaderboard();

  return NextResponse.json({
    totalReviewers: REVIEWERS.length,
    completedReviewers: completedList,
    pendingReviewers: pendingList,
    submissions: submissionsStore,
    leaderboard,
    winner,
  });
}