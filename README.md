# Vantage Wealth Management — TFSA Calculator

An interactive, lead-generation TFSA (Tax-Free Savings Account) calculator for **Vantage Wealth Management** (vantagewealth.ca). Built with React + Vite and Recharts, styled to match the firm's navy / gold / cream branding and serif identity.

## Features

- **TFSA Contribution Room Estimator** — enter birth year, lifetime contributions, and past withdrawals to estimate available room using official CRA annual limits from 2009 onward (2026 limit = $7,000, cumulative $109,000).
- **Investment Growth Calculator** — starting balance, monthly contribution, expected annual return, and time horizon with interactive sliders.
- **TFSA vs. Non-Registered Comparison** — side-by-side projected growth, with a user-adjustable estimated tax rate for the non-registered account.
- **Interactive Chart** — Recharts line chart updating live as inputs change (TFSA, non-registered, contributions).
- **Results** — estimated TFSA value, estimated non-registered value, total contributions, and estimated tax savings from using the TFSA.
- **Educational Section** — what a TFSA is, how contribution room accumulates, and that withdrawals are added back the following calendar year.
- **Disclaimer** — educational purposes only; confirms CRA My Account for official room.
- **Call-to-Action** — "Book a Meeting" linking to Vantage Wealth Management's existing Microsoft Bookings page.

## Tech Stack

- React 19 + Vite
- Recharts (charting)
- Plain CSS (Vantage brand tokens)
- No backend — fully static client-side app

## Local Development

```bash
npm install
npm run dev      # start dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Deployment (Render)

This is a static site. On Render, create a **Static Site** with:

- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

Or use the included `render.yaml` for Blueprint deployment.

## Project Structure

```
src/
  App.jsx        # main UI components and layout
  tfsaData.js    # TFSA limits, room estimator, growth projection logic
  index.css      # Vantage Wealth brand styling
index.html       # fonts, metadata, entry point
public/
  vantage-logo.png        # original logo (header)
  vantage-logo-light.png  # white/gold logo (dark footer)
render.yaml      # Render Blueprint config
```

## Disclaimer

This calculator is for educational purposes only. Results are estimates and not financial advice. Users should confirm official TFSA contribution room through CRA My Account.

© 2026 Vantage Wealth Management.
