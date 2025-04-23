# Scam Watch - Project Planning

## Vision
Create a comprehensive consumer protection platform where users can report and track unfair business practices, including price gouging, missing receipts, suspicious activities, and other consumer issues. This provides transparency and accountability in the marketplace, empowering consumers with information to make better decisions.

## Architecture
The application follows a modern web architecture:
- Frontend: React-based UI with responsive design
- Backend: API-driven data management (planned)
- Database: Relational database for flexibility with report data (planned)

## Tech Stack
- **Frontend**: Next.js 15.3.0 with TypeScript
- **UI Components**: Custom components with shadcn/ui primitives
- **Styling**: CSS-in-JS with inline styles
- **Fonts**: Acme (headings), Nunito (body)
- **Backend**: Next.js API routes (planned)
- **Database**: Supabase (PostgreSQL) for data storage, authentication, and file storage
- **Authentication**: Supabase Auth
- **Image Storage**: Supabase Storage

## Key Features (Prioritized)
1. **Core Features** (Implemented)
   - Multiple report types:
     - Price Gouging Reports
     - No Receipt Provided Reports
     - Suspicious Activity Reports
     - Unauthorized Business Reports
     - False Advertising Reports
     - Hidden Fees Reports
   - Dynamic report form with type-specific fields
   - Business listings with report categorization
   - Consumer Watchlist for suspicious businesses
   - Receipt Transparency tracking

2. **Enhanced Features** (In Progress)
   - User registration and authentication
   - Image upload for receipts/evidence
   - Report filtering and search
   - User profile and saved reports
   
3. **Advanced Features** (Planned)
   - Location-based search/mapping
   - Reporting analytics and trends
   - Community engagement (comments, votes)
   - Verified business responses
   - Mobile app version

## Design Principles
- Modern, clean interface with clear visual hierarchy
- Mobile-first responsive design
- Accessible to all users
- Consistent visual language and component styling
- Intuitive navigation and user flows

## Content Organization
- Homepage: Overview with recent reports and watchlist
- Reports: All submitted reports with filtering options
- New Report: Dynamic form based on report type
- Businesses: Directory of reported businesses
- Watchlist: Suspicious businesses with detailed information

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