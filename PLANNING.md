# Scam Watch - Project Planning

## Vision
Empower Ethiopian consumers by providing a transparent, community-driven platform to report, search, and monitor scams and unethical business practices. The goal is to foster marketplace accountability and promote safer consumer decisions.

## Architecture Overview
- **Frontend:** Next.js (App Router) with React, TypeScript, and Tailwind CSS
- **API/Data:** Next.js API routes (planned), with future Supabase/PostgreSQL integration
- **Localization:** `next-intl` for multilingual support
- **Image Handling:** Custom component with fallback support
- **Mapping:** City/area-based geocoding with randomized marker offsets

## Tech Stack
- Next.js 15.x, TypeScript
- React, Tailwind CSS
- shadcn/ui primitives
- next-intl (i18n)
- (Planned) Supabase: database, auth, storage

## Features Roadmap
### Implemented
- Multi-type scam reporting (price gouging, no receipt, suspicious activity, etc.)
- Dynamic report forms and validation
- Business directory with scam statistics
- Watchlist for suspicious businesses
- Receipt transparency tracking
- Responsive, accessible UI
- Localization (Amharic, English)
- Image uploads for reports
- Map visualization using city/area names

### In Progress
- Enhanced search and filtering
- User registration/authentication
- Profile and saved reports
- Improved admin tools

### Planned
- Full Supabase backend integration
- Real-time comments and voting
- Analytics and trend dashboards
- Verified business responses
- Mobile app version

## Design Principles
- Clean, modern, and accessible design
- Mobile-first, responsive layouts
- Clear navigation and user flows
- Privacy-first and inclusive

## Main Content Areas
- **Home:** Overview, stats, latest reports
- **Reports:** Browse/filter all scam reports
- **Businesses:** Directory and business details
- **Report Form:** Submit new scam reports
- **Watchlist:** Track flagged businesses
- **Map:** Visualize business locations

---
*This plan will be updated as the project evolves. See TASKS.md for actionable items and progress tracking.*

## User Experience Focus
- Simple and intuitive reporting process
- Clear categorization of consumer issues
- Visual indicators for report severity and frequency
- Interactive elements with hover states and feedback
- Consistent styling and navigation patterns

## Development Approach
- Component-based architecture for reusability
- Iterative enhancement of features
- Responsive testing across device sizes
- Performance optimization
- Accessibility standards compliance

## Deployment Strategy
- Development: Local environment
- Staging/Production: Vercel for frontend
- Database: Supabase (free tier initially, with upgrade path)


Color Refinements
Created a background color function that provides subtle, matching backgrounds
Used proper color opacity for backgrounds vs. borders
Ensured good contrast between text and backgrounds
Made icon containers more visually distinct

Layout Improvements

Changed alignment to flex-start for better text wrapping
Added proper line height for description text
Ensured consistent padding across all components
Made components responsive with flexible layouts

Replaced generic icons with more specific ones for each report type:
Receipt Issue: Document icon with lines
Suspicious Activity: Warning triangle icon
Unauthorized Charges: Credit card icon
False Advertising: Catalog/brochure icon
Hidden Fees: Dollar sign icon