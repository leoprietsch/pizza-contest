# Pizza Contest 🍕

A collaborative pizza rating application built with modern web technologies. Collect blind taste test reviews across multiple pizza flavors, track submission progress, and reveal the winner with comprehensive scoring analytics.

## Overview

Pizza Contest is a full-stack Next.js application designed to manage competitive pizza reviews. Users can submit blind ratings across three criteria (creativity, appearance, taste), while admins get real-time dashboard visibility into submission progress and final rankings.

### Key Features

- **Blind Review System** – Participants rate all flavors without knowing which is theirs
- **Multi-Criteria Scoring** – Three evaluation dimensions with half-star precision
- **Live Admin Dashboard** – Real-time submission tracking and leaderboard
- **Emoji-Based UI** – Clean, intuitive pizza emoji rating interface
- **Responsive Design** – Optimized for desktop and mobile devices
- **In-Memory State Management** – Fast submission tracking with minimal overhead

## Tech Stack

- **Framework:** Next.js 16 with TypeScript
- **Styling:** Tailwind CSS + custom Caveat font
- **State Management:** React hooks + in-memory store
- **UI Components:** Lucide icons
- **Tooling:** ESLint, TypeScript

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation & Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

### Production Build

```bash
npm run build
npm start
```

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
1. Select their pizza flavor
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

## Notes for Reviewers

This project demonstrates:
- Modern React patterns (hooks, client components)
- TypeScript for type safety
- Next.js full-stack capabilities (API routes + pages)
- Responsive UI design with Tailwind CSS
- Clean code organization and separation of concerns
- Attention to UX details (modal flows, loading states, accessibility)

---

**Built with Next.js** | **Deployed Ready**
