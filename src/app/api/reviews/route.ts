import { NextResponse } from 'next/server';
import {
  submissionsStore,
  completedFlavorsStore,
  CategoryRating,
} from '../../lib/store';

// GET: Fetch list of flavors that have already submitted
export async function GET() {
  return NextResponse.json({
    completedFlavors: Array.from(completedFlavorsStore),
  });
}

// POST: Handle new review submission with strict server-side validation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { flavor, reviews } = body as {
      flavor: string;
      reviews: Record<string, CategoryRating>;
    };

    if (!flavor) {
      return NextResponse.json(
        { error: 'Pizza flavor selection is required.' },
        { status: 400 }
      );
    }

    // Server-side check 1: Is this a valid flavor?
    const VALID_FLAVORS = ['Pepperoni', 'Margherita', 'Bacon', 'Vegetarian'];
    if (!VALID_FLAVORS.includes(flavor)) {
      return NextResponse.json(
        { error: 'Invalid pizza flavor.' },
        { status: 400 }
      );
    }

    // Server-side check 2: Has this flavor already submitted?
    if (completedFlavorsStore.has(flavor)) {
      return NextResponse.json(
        { error: `The ${flavor} pizza has already been submitted!` },
        { status: 403 }
      );
    }

    // Server-side check 3: Prevent voting on own flavor by stripping it from payload
    const sanitizedReviews = { ...reviews };
    if (sanitizedReviews[flavor]) {
      delete sanitizedReviews[flavor];
    }

    // Store in memory on the server
    const newSubmission = {
      id: Math.random().toString(36).substring(2, 9),
      flavor,
      timestamp: new Date().toISOString(),
      reviews: sanitizedReviews,
    };

    submissionsStore.push(newSubmission);
    completedFlavorsStore.add(flavor);

    return NextResponse.json({ success: true, submission: newSubmission });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error saving review on server.' },
      { status: 500 }
    );
  }
}