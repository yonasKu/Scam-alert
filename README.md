# Scam Watch

Scam Watch is a modern web application designed to empower consumers in Ethiopia by enabling them to report, search, and track scams and unethical business practices. The platform provides a transparent, community-driven space for sharing scam experiences and helps users make safer decisions when engaging with businesses.

## Table of Contents
- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Report Scams:** Users can submit detailed scam reports, including descriptions, categories, and images.
- **Business Directory:** Search and view businesses, see scam reports associated with them, and their scam risk scores.
- **Interactive Map:** Visualize reported businesses on a map, with geocoding based on Ethiopian city/area names.
- **Image Uploads:** Attach photos as evidence to reports, with robust image handling and fallback support.
- **Localization:** Multilingual support (e.g., Amharic, English) using `next-intl`.
- **Responsive UI:** Clean, mobile-friendly interface with professional design.
- **Watchlist:** Add businesses to a personal watchlist for quick monitoring.
- **Data Privacy:** Anonymous reporting and privacy-conscious design.

## How It Works
1. **Reporting:** Users fill out a form with scam details, select a business (or add a new one), and optionally upload images.
2. **Review:** Submitted reports are displayed in a searchable, filterable list and on the map.
3. **Business Profiles:** Each business page shows scam statistics, report types, and recent reports.
4. **Map Display:** Locations are geocoded from city/area names (not exact coordinates) and visualized with randomized offsets for privacy.

## Tech Stack
- **Framework:** Next.js (App Router, TypeScript)
- **Frontend:** React, Tailwind CSS
- **State Management:** React hooks, Context API
- **Localization:** `next-intl`
- **Map Integration:** Custom geocoding for Ethiopian cities/areas
- **Image Handling:** Custom `ImageWithFallback` component
- **Testing:** (Add details if any test frameworks are used)

## Project Structure
```
scam-watch/
├── src/
│   ├── app/           # Next.js app routes and pages
│   ├── components/    # UI and feature components
│   ├── lib/           # API utilities, geocoding, etc.
│   └── ...
├── public/            # Static assets (images, icons, etc.)
├── messages/          # Localization files
├── migrations/        # Database migrations
├── ...
```

## Setup & Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/scam-watch.git
   cd scam-watch
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment:**
   - Copy `.env.local.example` to `.env.local` and update as needed.
4. **Run the development server:**
   ```sh
   npm run dev
   ```
5. **Open the app:**
   - Visit [http://localhost:3000](http://localhost:3000)

## Usage
- **Reporting a Scam:** Navigate to the "Report" page, fill in the details, and submit.
- **Browsing Reports:** Go to the "Reports" page to search, filter, and view scam reports.
- **Viewing Businesses:** Use the "Businesses" directory and map to find business profiles and scam histories.
- **Watchlist:** Add businesses to your watchlist for monitoring.

## Contributing
Contributions are welcome! Please:
- Fork the repo and create a feature branch
- Follow code style and add tests if possible
- Open a pull request with a clear description

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

*Empowering consumers. Promoting transparency. Fighting scams together.*
