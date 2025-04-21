# App Blueprint: Scam Watch

## 1. Project Overview

**App Name:** Scam Watch  
**Platform:** Web application  
**Vision Summary:** Scam Watch is a community-driven platform that empowers consumers to report and expose unfair pricing practices and scams. Users can share instances of price gouging, unexpected surcharges, misleading pricing, and other suspicious business activities with evidence like receipts. By crowdsourcing these reports, Scam Watch creates transparency in consumer pricing, helps shoppers make informed decisions, and holds businesses accountable.

**Primary Use Case:**  
A customer notices their grocery bill is significantly higher than expected. They take a photo of their receipt, upload it to Scam Watch, tag the store location and product category, and describe the issue. Other users can view this report, validate it, and make more informed shopping decisions.

## 2. Tech Stack Implementation

### Frontend Framework:  
- **React + Next.js (App Router)** with localization support via next-intl
- **TypeScript** for type safety across the application

### UI Components:  
- **Tailwind CSS** for utility-first styling with custom theme configuration
- **ShadCN** for accessible, pre-built components like Button, Card, Modal, Badge
- **React Hook Form** for form management in report submissions
- **Zod** for form validation with internationalized error messages

### Backend Services:  
- **Supabase** for:  
  - PostgreSQL database (storing reports, businesses, watchlist)
  - Authentication services
  - Storage (for receipt images and evidence)

### Internationalization:
- **next-intl** configured with Next.js App Router
- Multi-language support (currently English and Amharic)
- Locale-based routing via `[locale]` parameter
- Translation files stored in the messages directory

### Deployment:  
- **Vercel** for hosting and CI/CD pipeline

## 3. Core Features

### 1. Report Submission System
- Multi-step form with categorized issues (pricing, suspicious activity, receipt issues)
- Image upload capability for receipts and evidence
- Business tagging (name, location, category)
- Price comparison (before/after) for pricing issues
- Detailed description fields for explaining the issue

### 2. Report Browsing & Discovery
- Filterable reports by location, business, category
- Trending/most recent reports displayed on home page
- Detailed report view with evidence and comments
- Map-based visualization of reported businesses

### 3. Watchlist System
- Businesses with serious violations are flagged in the watchlist
- Alert levels (High, Medium, Low) based on report frequency and severity
- Categorized issues with report counts
- Interactive table with sortable columns

### 4. Receipt Transparency
- Business verification against receipts
- Modal-based interface for viewing business details
- Badge system for indicating verification status
- Issue categorization and reporting directly from receipts

### 5. Community Engagement
- Upvote/downvote system for report validity
- Comment threads on reports
- Contribution tracking for users
- Sharing capabilities to social media

### 6. Multi-language Support
- Full internationalization support
- Currently implemented: English and Amharic
- All UI elements, forms, and notifications translated
- Locale-specific formatting for dates, currency, and numbers

## 4. User Flows

### 1. Landing Experience
- **Hero Section:**
  - Bold, gradient headline explaining the platform purpose
  - Clear CTAs (Submit Report, View Reports, View Watchlist)
  - Key stats (reports filed, communities protected)
  - Map-based background illustration

- **Recent Reports Section:**
  - Card-based layout of recent submissions
  - Key details at a glance (business, issue type, date)
  - Quick access to full report details via modal

- **Watchlist Highlight:**
  - Table of businesses with high alert levels
  - Issue summaries and report counts
  - Link to full watchlist for more details

### 2. Report Submission Flow
- Step 1: Basic Information
  - Business name, location, category
  - Initial issue description
  
- Step 2: Report Type Selection
  - Visual selection of issue categories (pricing, receipt issues, suspicious activity)
  - Type-specific form fields (e.g., price before/after for pricing issues)

- Step 3: Evidence Upload
  - Receipt/photo upload interface
  - Description of evidence
  - Optional contact information

- Step 4: Review & Submit
  - Preview of report details
  - Terms confirmation
  - Submission confirmation

### 3. Report Viewing Flow
- List view of all reports with filtering options
- Detailed report page showing:
  - Business information
  - Issue details
  - Evidence/receipts
  - User comments and votes
  - Related reports
- Modal-based quick views for efficient browsing

## 5. Design & UI/UX Guidelines

### Visual Style
- **Color Palette:**
  - Primary: Custom theme color with gradient variations
  - Background: Clean, light background with subtle patterns
  - Accent colors:
    - Warning (amber/yellow) for alerts and watchlist
    - Destructive (red) for high alerts and critical issues
    - Muted tones for secondary information

### Typography
- **Headings:** Custom font via CSS variables (--font-heading)
- **Body:** System font stack optimized for readability
- **Hierarchical scale:** 
  - Responsive sizing using clamp() for fluid typography
  - Bold weights (700-800) for headings
  - Regular/medium (400-500) for body text

### Component Design
- **Cards** for report listings and information containers
- **Modals** for detailed views and forms
- **Badges** for status indicators
- **Tables** for structured data (watchlist, reports)
- **Gradient text** for section headlines
- **Interactive elements** with hover states and transitions

### Accessibility
- WCAG AA compliant contrast ratios
- ARIA labels for interactive elements
- Keyboard navigable interface
- Screen reader compatible components (using ShadCN)
- Responsive design for all screen sizes

## 6. Frontend Architecture

### Directory Structure
```
scam-watch/
├── .next/                  # Next.js build output
├── messages/               # Translation files by feature
│   ├── en.json             # English translations
│   └── am.json             # Amharic translations
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router pages
│   │   └── [locale]/       # Locale-based routing
│   │       ├── page.tsx    # Home page
│   │       ├── about/      # About page
│   │       ├── reports/    # Reports section
│   │       │   ├── page.tsx
│   │       │   ├── [id]/   # Individual report pages
│   │       │   └── new/    # New report submission
│   │       └── watchlist/  # Watchlist section
│   ├── components/         # Reusable components
│   │   ├── home/           # Home page components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── WatchlistSection.tsx
│   │   │   └── RecentReportsSection.tsx
│   │   ├── layout/         # Layout components
│   │   ├── maps/           # Map visualization components
│   │   └── ui/             # UI component library
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── modal.tsx
│   │       ├── badge.tsx
│   │       └── image-fallback.tsx
│   ├── lib/                # Utility functions and services
│   │   └── supabase.ts     # Supabase client configuration
│   ├── i18n/               # Internationalization setup
│   │   └── i18n.ts         # i18n configuration
│   ├── types/              # TypeScript type definitions
│   └── middleware.ts       # Next.js middleware (for i18n)
├── next-intl.config.js     # next-intl configuration
├── next.config.mjs         # Next.js configuration
└── tailwind.config.ts      # Tailwind CSS configuration
```

### Key Components

#### Layout Components
- **Header**: Navigation, language switcher, authentication controls
- **Footer**: Site links, about information, legal
- **Main Layout**: Wraps all pages with common structure

#### Home Page Components
- **HeroSection**: Main landing view with CTAs
- **RecentReportsSection**: Latest community reports
- **WatchlistSection**: Businesses with high alert levels
- **ReceiptTransparencySection**: Information about receipt verification

#### Report Components
- **ReportForm**: Multi-step form for submission
- **ReportsList**: Filterable list of reports
- **ReportDetail**: Comprehensive view of a single report
- **ReportModal**: Quick view popup for report details

#### UI Components
- **Button**: Various styles (primary, outline, warning)
- **Card**: Container for structured content
- **Modal**: Popup dialogs for details and forms
- **Badge**: Status indicators (alert levels, verification)
- **ImageFallback**: Graceful handling of image loading failures

## 7. Development Setup

### Prerequisites
- Node.js v18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Local Development
```bash
# Clone repository
git clone https://github.com/yourusername/scam-watch.git
cd scam-watch

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in Supabase credentials and other config

# Run development server
npm run dev
```

### Environment Variables
```
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Deployment
- Connected to Vercel for automatic deployments
- Environment variables configured in Vercel dashboard
- Internationalization properly configured for production builds

### Development Scripts
- `npm run dev` - Local development server
- `npm run build` - Production build
- `npm run start` - Run production build locally
- `npm run lint` - Run ESLint for code quality

## 8. Future Enhancements

### User Authentication Improvements
- Social login integration (Google, Apple)
- Optional anonymous posting
- Verified badge for users who submit ID verification

### Advanced Features
- Real-time notifications for new reports
- Business response system
- AI-powered duplicate detection
- Enhanced analytics dashboard
- Mobile app version

### Community Features
- User profiles with contribution history
- Reputation system for reliable reporters
- Community moderation tools
- Social sharing integrations

### Technical Improvements
- Server-side caching strategies
- Performance optimizations for map visualizations
- Enhanced image processing for receipts
- Offline capabilities for reliable reporting
