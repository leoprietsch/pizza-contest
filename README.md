# Pizza Contest 🍕

**[🚀 Live Demo](https://pizza-contest-xi.vercel.app/)**

A pizza rating application built with Nextjs/React, TypeScript. Collect blind taste test reviews across pizza flavors, track submission progress, and reveal the winners when voting is done.

> 🤖 **Developed using AI-First Approach with Spec-Driven Development methodology**


### Key Features

- **Blind Review System** – Participants rate all flavors without knowing which is theirs
- **Multi-Criteria Scoring** – Three evaluation dimensions with half-star precision
- **Live Admin Dashboard** – Real-time submission tracking and leaderboard
- **Emoji-Based UI** – Clean, intuitive pizza emoji rating interface
- **Responsive Design** – Optimized for desktop and mobile devices
- **In-Memory State Management** – Fast submission tracking with minimal overhead

## Tech Stack

- **Framework:** Next.js/React, using TypeScript
- **Styling:** Tailwind CSS + custom Caveat font
- **State Management:** React hooks + in-memory store
- **UI Components:** Lucide icons
- **Tooling:** ESLint, TypeScript

## Project Structure

```
src/app/
├── page.tsx              # Main review form & flavor selection
├── results/page.tsx      # Admin dashboard with leaderboard
├── api/
│   ├── reviews/route.ts  # Review submission & data retrieval
│   └── admin/route.ts    # Admin dashboard data endpoint
└── lib/
    └── store.ts          # In-memory store & scoring logic
```

## How It Works

### Participant Flow
1. Select their own pizza flavor
2. Rate all other flavors across three criteria
3. Submit anonymous review (stored server-side)

### Admin Flow
1. Access `/results` dashboard
2. Monitor submission progress in real-time
3. Reveal winning flavor once all submissions complete
4. View detailed rankings with average scores

## Scoring System

Each flavor receives scores (1-5) in three categories:
- **Creativity** – How unique and inventive the flavor combination is
- **Appearance** – Visual presentation and appeal
- **Taste** – Flavor quality and satisfaction

Overall score is calculated as the average of the three criteria.

## Development

The project uses Next.js API routes for backend logic and React hooks for state management. The scoring engine is decoupled in `lib/store.ts`, making it easy to extend or migrate to persistent storage.

### Key Components
- `PizzaReviewForm` – Interactive rating widget with emoji-based indicators
- `AdminDashboard` – Leaderboard and submission tracker
- `calculateLeaderboard()` – Core scoring and ranking logic

## Notes

This project has:
- Modern React patterns (hooks, client components)
- TypeScript for type safety
- Next.js full-stack capabilities (API routes + pages)
- Responsive UI design with Tailwind CSS
- Clean code organization and separation of concerns
- Attention to UX details (modal flows, loading states, accessibility)

### Development Methodology

This project was developed using **Spec-Driven Development** with an **AI-First approach**:
- Requirements were formalized into testable EARS-notation acceptance criteria
- Atomic, focused tasks ensured clean git history (one commit per task)
- Verification gates validated each implementation against the specification
- This approach enabled rapid, high-quality feature delivery with minimal rework

---

**Built with Next.js** | **Deployed Ready**
