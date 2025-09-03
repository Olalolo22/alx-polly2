# PollApp - Next.js Polling Application

A modern polling application built with Next.js 15, TypeScript, and Shadcn UI components. Create polls, vote on them, and see real-time results.

## Features

- **User Authentication**: Login and registration system
- **Poll Creation**: Create polls with multiple options and settings
- **Poll Voting**: Vote on polls with real-time results
- **Poll Browsing**: Browse and discover polls from other users
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Shadcn UI components and Tailwind CSS

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── polls/             # Poll-related pages
│   │   ├── create/        # Create new poll
│   │   ├── [id]/          # Individual poll view
│   │   └── page.tsx       # Polls listing
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # Shadcn UI components
│   │   ├── button.tsx    # Button component
│   │   ├── card.tsx      # Card components
│   │   └── input.tsx     # Input component
│   ├── layout/           # Layout components
│   │   └── navigation.tsx # Navigation bar
│   └── polls/            # Poll-specific components
│       ├── poll-card.tsx  # Poll card component
│       └── poll-results.tsx # Poll results display
├── lib/                  # Utility functions
│   └── utils.ts         # Shadcn utility functions
└── types/               # TypeScript type definitions
    └── poll.ts          # Poll-related types
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd alx-polly2
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database schema

The database schema is defined in `supabase/migrations/0001_create_polls.sql`:

- polls: poll metadata owned by a user
- poll_options: options for a poll
- votes: one vote per user per poll (enforced)
- poll_option_results: view aggregating votes per option

All tables have RLS enabled with safe policies. No secrets are hardcoded.

### Apply the migration

Option A: Supabase SQL Editor

1. Open the Supabase dashboard SQL Editor
2. Paste the contents of `supabase/migrations/0001_create_polls.sql`
3. Run

Option B: Supabase CLI

1. Install and login: `npm i -g supabase && supabase login`
2. Link project: `supabase link --project-ref <your-project-ref>`
3. Push migrations: `supabase db push`

Set env vars in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **State Management**: React hooks (ready for expansion)

## Features to Implement

- [ ] Database integration (Prisma + PostgreSQL)
- [ ] User authentication (NextAuth.js)
- [ ] Real-time voting with WebSockets
- [ ] Poll sharing functionality
- [ ] User dashboard
- [ ] Poll analytics
- [ ] Email notifications
- [ ] Mobile app (React Native)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
