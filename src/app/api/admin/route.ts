
import { NextResponse } from 'next/server';
import {
  submissionsStore,
  completedFlavorsStore,
  PIZZA_FLAVORS,
  calculateLeaderboard,
} from '../../lib/store';

export async function GET() {
  const completedList = Array.from(completedFlavorsStore);
  const pendingList = PIZZA_FLAVORS.filter((name) => !completedFlavorsStore.has(name));
  const { leaderboard, winner } = calculateLeaderboard();

  return NextResponse.json({
    totalFlavors: PIZZA_FLAVORS.length,
    completedFlavors: completedList,
    pendingFlavors: pendingList,
    submissions: submissionsStore,
    leaderboard,
    winner,
  });
}