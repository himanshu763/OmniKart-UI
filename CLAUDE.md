# OmniKart UI — Claude Code Instructions

## Project Context
React 19 + Vite 8 + Tailwind 4 frontend for a price comparison engine.
Backend: Spring Boot at localhost:8080 (Market Sentinel).
Full design spec: DESIGN.md | Full execution plan: plan.md

## How to Work
- Always read plan.md before starting ANY task to understand phase dependencies
- Always read DESIGN.md section relevant to the component you're touching
- Work ONE phase at a time. Never jump ahead.
- After every task: run lint, then run tests, fix all failures before moving on
- If something is ambiguous, check DESIGN.md first before asking me

## Execution Order (STRICT)
Follow plan.md phases exactly:
1. Phase 1 (Foundation) must be 100% done before Phase 2
2. Phase 2 (Quality Gates) must be 100% done before Phase 3
3. Never skip a checkbox in plan.md

## After Every File Change
1. Run: npm run lint
2. Run: npm run test (once Vitest is set up)
3. Fix ALL errors before proceeding to next task
4. Update the relevant checkbox in plan.md to [x]

## Code Conventions
- Functional components only, no class components
- Named exports only, no default exports
- Props typed with explicit TypeScript interfaces, co-located in component file
- No prop drilling deeper than 2 levels
- Custom hooks in src/hooks/
- API calls only in hooks, never in components
- No inline styles — Tailwind utility classes only
- No `any` type in TypeScript

## File Structure (target — from DESIGN.md Section 4 + plan.md P1.2)
```
src/
├── components/
│   ├── layout/Header.tsx
│   ├── search/SearchForm.tsx
│   ├── results/
│   │   ├── PrimaryProductCard.tsx
│   │   ├── AlternativesGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ConfidenceBadge.tsx
│   │   └── StatusSidebar.tsx
│   ├── feedback/
│   │   ├── ErrorBanner.tsx
│   │   ├── EmptyState.tsx
│   │   └── LoadingState.tsx
│   └── ErrorBoundary.tsx
├── hooks/useProductComparison.ts
├── types/api.ts
├── lib/validation.ts
├── App.tsx
├── main.tsx
└── index.css
```

## TypeScript Types (use exactly these — from DESIGN.md Section 8)
See src/types/api.ts:
- Product { title, price, productUrl }
- PlatformResult { product, platform, status: 'success'|'skipped' }
- SimilarProduct { product, platform, confidence: number }
- ComparisonResponse { results, similarProducts }

## API Contract (DO NOT change this)
POST /api/compare
Body: { url: string }
Base URL: import.meta.env.VITE_API_URL || ''

## Testing Rules (QA Mode)
When writing tests, cover ALL of these scenarios per component:
- Happy path (normal data renders correctly)
- Empty/null data (no crash, shows EmptyState)
- Error state (ErrorBanner renders)
- Loading state (spinner/skeleton visible, button disabled)
- Edge cases (missing fields, very long strings, special chars in titles)
- Accessibility (aria-labels present, roles correct)

Target: 80%+ line coverage on src/

## Security Checklist (verify after every component)
- [ ] External <a> tags have target="_blank" rel="noopener noreferrer"
- [ ] No key={index} in .map() — use stable unique keys
- [ ] All inputs have aria-label
- [ ] No inline event handlers that expose sensitive data

## Do NOT Touch
- .env files
- nginx.conf (until Phase 3)
- Dockerfile (until Phase 3)
- package.json scripts (unless adding test/lint scripts in P2.1)
- DESIGN.md (read-only reference)

## Quick Wins — Do These First (< 30 min total)
Before any Phase 1 structural work, knock out these immediately:
1. Delete App.css and unused assets (react.svg, vite.svg, public/icons.svg)
2. Fix index.html title to "OmniKart - Find the Best Deal Instantly" + add meta tags
3. Add rel="noopener noreferrer" to all external links in App.jsx
4. Fix error message "Server expansion failed" in useProductComparison.js
5. Add aria-label to search input and button
6. Make error state actually render in UI
7. Replace key={idx} with stable keys
