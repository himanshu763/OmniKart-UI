# OMNIKART-UI

React frontend application.

## Stack
- React 18, TypeScript
- React Router v6
- Tailwind CSS (or whatever you use)
- Axios for API calls

## Conventions
- Functional components only, no class components
- Custom hooks in /src/hooks
- All API calls go through /src/services
- Use named exports, not default exports
- CSS: Tailwind utility classes only

## File structure
src/
  components/   # reusable UI components
  pages/        # route-level components
  hooks/        # custom hooks
  services/     # API layer
  types/        # TypeScript interfaces

## Do not
- No inline styles
- No any type in TypeScript
- Don't touch .env files