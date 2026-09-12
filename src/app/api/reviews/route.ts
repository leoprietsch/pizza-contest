import { NextResponse } from 'next/server';
import {
  submissionsStore,
  completedReviewersStore,
  REVIEWER_DUO_MAP,
  CategoryRating,
} from '../../lib/store';

// GET: Fetch list of reviewers who have already submitted
export async function GET() {
  return NextResponse.json({
    completedReviewers: Array.from(completedReviewersStore),
  });
}

// POST: Handle new review submission with strict server-side validation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reviewer, reviews } = body as {
      reviewer: string;
      reviews: Record<string, CategoryRating>;
    };

    if (!reviewer) {
      return NextResponse.json(
        { error: 'Identificação do avaliador é obrigatória.' },
        { status: 400 }
      );
    }

    // Server-side check 1: Has this reviewer already submitted?
    if (completedReviewersStore.has(reviewer)) {
      return NextResponse.json(
        { error: `O avaliador ${reviewer} já enviou uma avaliação!` },
        { status: 403 }
      );
    }

    // Server-side check 2: Prevent voting on own duo by stripping it from payload
    const ownDuo = REVIEWER_DUO_MAP[reviewer];
    const sanitizedReviews = { ...reviews };
    if (ownDuo && sanitizedReviews[ownDuo]) {
      delete sanitizedReviews[ownDuo];
    }

    // Store in memory on the server
    const newSubmission = {
      id: Math.random().toString(36).substring(2, 9),
      reviewer,
      timestamp: new Date().toISOString(),
      reviews: sanitizedReviews,
    };

    submissionsStore.push(newSubmission);
    completedReviewersStore.add(reviewer);

    return NextResponse.json({ success: true, submission: newSubmission });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao salvar avaliação no servidor.' },
      { status: 500 }
    );
  }
}