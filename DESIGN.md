# OmniKart UI - Frontend Design Document

**Version:** 2.0 Beta
**Package:** `market-sentinel-ui`
**Last Updated:** 2026-04-14

---

## Table of Contents

1. [Overview](#1-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Directory Structure](#4-directory-structure)
5. [Component Architecture](#5-component-architecture)
6. [State Management](#6-state-management)
7. [API Integration](#7-api-integration)
8. [Data Models](#8-data-models)
9. [UI / UX Design](#9-ui--ux-design)
10. [Styling Architecture](#10-styling-architecture)
11. [Build & Bundle Pipeline](#11-build--bundle-pipeline)
12. [Deployment Architecture](#12-deployment-architecture)
13. [CI/CD Pipeline](#13-cicd-pipeline)
14. [Environment Configuration](#14-environment-configuration)
15. [Security Considerations](#15-security-considerations)
16. [Future Improvements](#16-future-improvements)

---

## 1. Overview

### 1.1 Purpose

OmniKart UI is a **product price comparison** single-page application. Users paste a product URL from an e-commerce marketplace (Amazon, Flipkart, etc.) and the application scans multiple platforms to find better deals, alternatives, and price comparisons in real time.

### 1.2 Core User Flow

```
User pastes product URL → Backend scrapes marketplaces → UI displays comparison results
```

### 1.3 Key Features

- Single-input search interface for product URLs
- Real-time price comparison across marketplaces
- Confidence-scored alternative product suggestions
- Platform availability status tracking
- Responsive design (mobile through desktop)

---

## 2. Tech Stack

| Layer         | Technology                    | Version  |
|---------------|-------------------------------|----------|
| Framework     | React                         | 19.2.4   |
| Build Tool    | Vite                          | 8.0.1    |
| Language      | JavaScript (ES2020+)          | -        |
| Styling       | Tailwind CSS                  | 4.2.2    |
| PostCSS       | autoprefixer + PostCSS        | 8.5.8    |
| Linting       | ESLint                        | 9.39.4   |
| HTTP          | Native Fetch API              | -        |
| Server        | Nginx (production)            | Alpine   |
| Container     | Docker (multi-stage)          | -        |
| CI/CD         | GitHub Actions                | -        |
| Registry      | GitHub Container Registry     | -        |

### 2.1 Dependency Philosophy

The project follows a **minimal dependency** approach:

- **No routing library** -- single-page with conditional rendering
- **No state management library** -- React hooks only
- **No HTTP client library** -- native `fetch()`
- **No CSS-in-JS** -- Tailwind utility classes only
- **No authentication library** -- public-facing; auth delegated to backend

**Production dependencies are limited to `react` and `react-dom` only.**

---

## 3. Architecture

### 3.1 High-Level System Architecture

```mermaid
graph TB
    subgraph Client["Browser (Client)"]
        UI["React SPA<br/>OmniKart UI"]
    end

    subgraph Docker["Docker Host (EC2)"]
        subgraph Frontend["Frontend Container"]
            Nginx["Nginx<br/>:80"]
            Static["Static Files<br/>(dist/)"]
        end

        subgraph Backend["Backend Container"]
            Spring["Spring Boot<br/>:8080"]
        end
    end

    subgraph External["External Marketplaces"]
        Amazon["Amazon"]
        Flipkart["Flipkart"]
        Others["Other Platforms"]
    end

    UI -->|"HTTP :80"| Nginx
    Nginx -->|"Serve static"| Static
    Nginx -->|"Proxy /api/*"| Spring
    Spring -->|"Scrape"| Amazon
    Spring -->|"Scrape"| Flipkart
    Spring -->|"Scrape"| Others
```

### 3.2 Request Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Nginx
    participant SpringBoot as Spring Boot

    User->>Browser: Pastes product URL & submits
    Browser->>Nginx: POST /api/compare {url}
    Nginx->>SpringBoot: Proxy to app:8080/api/compare
    SpringBoot->>SpringBoot: Scrape marketplaces
    SpringBoot-->>Nginx: JSON response
    Nginx-->>Browser: JSON response
    Browser->>Browser: Render comparison results
    Browser-->>User: Display deals & alternatives
```

### 3.3 Frontend Application Architecture

```mermaid
graph LR
    subgraph Entry
        HTML["index.html"]
        Main["main.jsx"]
    end

    subgraph Application
        App["App.jsx<br/>(Root Component)"]
    end

    subgraph Hooks
        Hook["useProductComparison"]
    end

    subgraph Styling
        IndexCSS["index.css<br/>(Global + Tailwind)"]
        AppCSS["App.css<br/>(Legacy)"]
    end

    HTML --> Main
    Main --> App
    App --> Hook
    App --> IndexCSS
    App --> AppCSS
    Hook -->|"fetch()"| API["Backend API"]
```

---

## 4. Directory Structure

```
OmniKart-UI/
├── .github/
│   └── workflows/
│       └── ci-cd.yml               # GitHub Actions CI/CD pipeline
├── public/
│   ├── favicon.svg                  # Browser tab icon
│   └── icons.svg                    # SVG icon sprite
├── src/
│   ├── main.jsx                     # React DOM entry point
│   ├── App.jsx                      # Root component (all UI)
│   ├── App.css                      # Legacy supplementary styles
│   ├── index.css                    # Global styles + Tailwind directives
│   ├── assets/
│   │   └── hero.png                 # Hero image asset
│   └── hooks/
│       └── useProductComparison.js  # API integration hook
├── Dockerfile                       # Multi-stage build (Node → Nginx)
├── nginx.conf                       # Nginx reverse proxy config
├── index.html                       # HTML shell
├── vite.config.js                   # Vite build configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS plugin configuration
├── eslint.config.js                 # ESLint flat config
├── package.json                     # Dependencies & scripts
└── package-lock.json
```

---

## 5. Component Architecture

### 5.1 Component Tree

The application uses a **monolithic component** pattern -- all UI resides in a single `App.jsx` file with inline conditional rendering.

```mermaid
graph TD
    App["App.jsx"]

    App --> Header["Header Section<br/>(Sticky Navbar)"]
    App --> Hero["Hero Section<br/>(Search Form)"]
    App --> Loading["Loading State<br/>(Conditional)"]
    App --> Results["Results Section<br/>(Conditional)"]

    Header --> Logo["Logo + Brand"]
    Header --> Badge["Version Badge"]

    Hero --> Heading["Heading + Subtext"]
    Hero --> Form["URL Input Form"]

    Form --> Input["Text Input"]
    Form --> Button["Submit Button"]

    Loading --> Spinner["Spinner Animation"]
    Loading --> Pulse["Skeleton Cards"]

    Results --> Primary["Primary Product Card"]
    Results --> Grid["Alternatives Grid"]
    Results --> Sidebar["Status Sidebar"]

    Primary --> ProdTitle["Product Title"]
    Primary --> ProdPrice["Price Display"]
    Primary --> ProdLink["'View Deal' Link"]

    Grid --> Card1["Alternative Card 1"]
    Grid --> Card2["Alternative Card 2"]
    Grid --> CardN["Alternative Card N"]

    Card1 --> ConfBadge["Confidence Badge"]
    Card1 --> CardPrice["Price"]
    Card1 --> CardLink["Platform Link"]

    Sidebar --> Status1["Platform Status 1"]
    Sidebar --> StatusN["Platform Status N"]
```

### 5.2 Component Responsibilities

| Section             | Responsibility                                                  |
|---------------------|-----------------------------------------------------------------|
| **Header**          | Persistent navigation bar with logo and version badge           |
| **Hero / Search**   | URL input form, form validation, submission handling             |
| **Loading State**   | Spinner animation + pulsating skeleton cards during API call     |
| **Primary Card**    | Displays the source product with title, price, and external link |
| **Alternatives Grid** | Renders marketplace alternatives with confidence badges        |
| **Status Sidebar**  | Shows per-platform scan status (success / skipped)              |

### 5.3 Confidence Badge Logic

```mermaid
graph TD
    Score["confidence score"]
    Score -->|">= 0.7"| Green["Green Badge<br/>'X% Match'<br/>bg-emerald-100"]
    Score -->|">= 0.5"| Amber["Amber Badge<br/>'X% Match'<br/>bg-amber-100"]
    Score -->|"< 0.5"| Red["Red Badge<br/>'X% Match'<br/>bg-rose-100"]
```

---

## 6. State Management

### 6.1 Approach

State is managed entirely through **React's built-in hooks** (`useState`). No external state management library is used.

### 6.2 State Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Loading : User submits URL
    Loading --> Success : API returns data
    Loading --> Error : API call fails
    Success --> Loading : User submits new URL
    Error --> Loading : User retries
    Success --> Idle : (data persists until next search)
```

### 6.3 State Variables

| Variable   | Type               | Owner Hook / Component       | Description                        |
|------------|--------------------|-----------------------------|-------------------------------------|
| `inputUrl` | `string`           | `App.jsx` (useState)        | Current value of the URL input      |
| `data`     | `object \| null`   | `useProductComparison` hook | Parsed API response                 |
| `loading`  | `boolean`          | `useProductComparison` hook | Whether an API call is in progress  |
| `error`    | `string \| null`   | `useProductComparison` hook | Error message from failed API call  |

### 6.4 Data Flow

```mermaid
flowchart LR
    Input["URL Input<br/>(inputUrl)"]
    Hook["useProductComparison"]
    API["Backend API"]
    UI["UI Render"]

    Input -->|"handleSearch()"| Hook
    Hook -->|"POST /api/compare"| API
    API -->|"JSON response"| Hook
    Hook -->|"{ data, loading, error }"| UI
```

---

## 7. API Integration

### 7.1 API Contract

**Endpoint:** `POST /api/compare`

**Base URL Resolution:**

| Environment | Base URL                 | Resolution Strategy              |
|-------------|--------------------------|----------------------------------|
| Development | `http://localhost:8080`  | `VITE_API_URL` env variable      |
| Production  | ` ` (empty string)      | Relative path → Nginx proxies    |

```javascript
const API_BASE = import.meta.env.VITE_API_URL || '';
```

### 7.2 Request / Response Schema

**Request:**
```json
{
  "url": "https://www.amazon.in/dp/B0EXAMPLE"
}
```

**Response:**
```json
{
  "results": [
    {
      "product": {
        "title": "Product Name",
        "price": "₹5,999",
        "productUrl": "https://..."
      },
      "platform": "Amazon",
      "status": "success"
    }
  ],
  "similarProducts": [
    {
      "product": {
        "title": "Alternative Product",
        "price": "₹4,499",
        "productUrl": "https://..."
      },
      "platform": "Flipkart",
      "confidence": 0.85
    }
  ]
}
```

### 7.3 Error Handling

```mermaid
flowchart TD
    Fetch["fetch('/api/compare')"]
    Fetch -->|"HTTP OK"| Parse["Parse JSON"]
    Fetch -->|"Network Error"| Catch["catch block"]
    Parse -->|"Valid JSON"| SetData["setData(json)"]
    Parse -->|"!res.ok"| ThrowErr["throw Error(status)"]
    ThrowErr --> Catch
    Catch --> SetError["setError(message)"]

    SetData --> RenderResults["Render results"]
    SetError --> RenderError["Render error message"]
```

- No retry logic implemented
- No request timeout configured
- No request cancellation (AbortController) on component unmount
- Error message displayed inline below the search form

---

## 8. Data Models

### 8.1 Class Diagram

```mermaid
classDiagram
    class ComparisonResponse {
        +Result[] results
        +SimilarProduct[] similarProducts
    }

    class Result {
        +Product product
        +String platform
        +String status
    }

    class SimilarProduct {
        +Product product
        +String platform
        +Number confidence
    }

    class Product {
        +String title
        +String price
        +String productUrl
    }

    class AppState {
        +String inputUrl
        +ComparisonResponse data
        +Boolean loading
        +String error
    }

    ComparisonResponse "1" --> "*" Result
    ComparisonResponse "1" --> "*" SimilarProduct
    Result "1" --> "1" Product
    SimilarProduct "1" --> "1" Product
    AppState "1" --> "0..1" ComparisonResponse : data
```

### 8.2 Type Definitions (Logical)

While the project uses plain JavaScript, the logical types are:

```
Product {
    title:      string
    price:      string          // Pre-formatted (e.g., "₹5,999")
    productUrl: string          // Full URL to product page
}

Result {
    product:    Product
    platform:   string          // "Amazon" | "Flipkart" | ...
    status:     "success" | "skipped"
}

SimilarProduct {
    product:    Product
    platform:   string
    confidence: number          // 0.0 to 1.0
}

ComparisonResponse {
    results:         Result[]
    similarProducts: SimilarProduct[]
}
```

---

## 9. UI / UX Design

### 9.1 Page Layout

```
┌─────────────────────────────────────────────────────┐
│  HEADER (sticky)                                    │
│  [Logo: OmniKart]                    [v2.0 Beta]    │
├─────────────────────────────────────────────────────┤
│                                                     │
│         Find the Best Deal. Instantly.              │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  Paste any product link...          [Search] │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  YOUR PRODUCT                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │  [Image]  Title                              │    │
│  │           Price: ₹X,XXX                      │    │
│  │           Platform: Amazon                   │    │
│  │           [View on Amazon →]                 │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  MARKET ALTERNATIVES             STATUS SIDEBAR     │
│  ┌──────────┐ ┌──────────┐    ┌──────────────────┐  │
│  │ Alt #1   │ │ Alt #2   │    │ Amazon ✓ Found   │  │
│  │ ₹X,XXX  │ │ ₹X,XXX  │    │ Flipkart ✓ Found │  │
│  │ 85% ●   │ │ 72% ●   │    │ Croma — Skipped  │  │
│  └──────────┘ └──────────┘    └──────────────────┘  │
│  ┌──────────┐ ┌──────────┐                          │
│  │ Alt #3   │ │ Alt #4   │                          │
│  │ ₹X,XXX  │ │ ₹X,XXX  │                          │
│  │ 60% ●   │ │ 45% ●   │                          │
│  └──────────┘ └──────────┘                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 9.2 Responsive Breakpoints

| Breakpoint | Width   | Layout Behavior                            |
|------------|---------|---------------------------------------------|
| Default    | < 640px | Single column, full-width cards             |
| `sm:`      | 640px+  | 2-column alternative grid                   |
| `md:`      | 768px+  | Sidebar appears alongside grid              |
| `lg:`      | 1024px+ | 3-column alternative grid + sticky sidebar  |

### 9.3 Color Palette

| Role        | Color                | Tailwind Class     | Usage                          |
|-------------|----------------------|--------------------|--------------------------------|
| Primary     | Indigo 600           | `indigo-600`       | Buttons, links, accents        |
| Accent      | Violet / Purple      | `violet-*`         | Gradient highlights            |
| Neutral     | Slate 50–900         | `slate-*`          | Backgrounds, text, borders     |
| Success     | Emerald 500          | `emerald-*`        | High confidence, success status|
| Warning     | Amber 500            | `amber-*`          | Medium confidence              |
| Danger      | Rose 500             | `rose-*`           | Low confidence, errors         |
| Background  | Slate 50 + gradient  | `bg-slate-50`      | Page background                |

### 9.4 UI States

```mermaid
stateDiagram-v2
    [*] --> Empty : Page load

    Empty : Hero + search form visible
    Empty : No results section

    Empty --> Loading : User submits URL

    Loading : Spinner visible
    Loading : Skeleton pulse cards
    Loading : Submit button disabled

    Loading --> ResultsView : Data received
    Loading --> ErrorView : Fetch failed

    ResultsView : Primary card visible
    ResultsView : Alternatives grid visible
    ResultsView : Status sidebar visible

    ErrorView : Red error banner
    ErrorView : Search form still active

    ResultsView --> Loading : New search
    ErrorView --> Loading : Retry search
```

---

## 10. Styling Architecture

### 10.1 Approach

The project uses a **utility-first CSS** approach via Tailwind CSS. No component-scoped CSS, CSS modules, or CSS-in-JS libraries are used.

### 10.2 Style Layers

```mermaid
graph TD
    Tailwind["@tailwindcss/vite plugin"]
    IndexCSS["index.css<br/>Global styles + CSS variables"]
    AppCSS["App.css<br/>Legacy styles (mostly unused)"]
    Utilities["Tailwind Utility Classes<br/>(inline in JSX)"]

    Tailwind --> IndexCSS
    IndexCSS --> Output["Final CSS Bundle"]
    AppCSS --> Output
    Utilities --> Output
```

### 10.3 Global CSS Variables

```css
:root {
    --brand-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
}
```

### 10.4 Design Tokens

| Token              | Value                              |
|--------------------|------------------------------------|
| Font Family        | Inter, system-ui, sans-serif       |
| Border Radius      | `rounded-xl` to `rounded-3xl`     |
| Shadow             | `shadow-lg` to `shadow-2xl`       |
| Transition         | Tailwind defaults (150ms–300ms)    |
| Spacing Base       | 4px (Tailwind default scale)       |
| Max Content Width  | `max-w-7xl` (80rem / 1280px)      |

### 10.5 Animations

| Animation          | Implementation             | Usage                      |
|--------------------|----------------------------|----------------------------|
| Spinner            | `animate-spin`             | Loading indicator          |
| Skeleton Pulse     | `animate-pulse`            | Placeholder cards          |
| Button Press       | `active:scale-95`          | Submit button feedback     |
| Hover Effects      | `hover:shadow-*`, `hover:border-*` | Card interactions   |
| Scroll Behavior    | `scroll-behavior: smooth`  | Page navigation            |

---

## 11. Build & Bundle Pipeline

### 11.1 Build Process

```mermaid
flowchart LR
    Source["Source Files<br/>(JSX, CSS)"]
    Vite["Vite 8.0.1"]
    React["@vitejs/plugin-react<br/>(Oxc transforms)"]
    TW["@tailwindcss/vite<br/>(Tailwind processing)"]
    PostCSS["PostCSS<br/>+ autoprefixer"]
    Dist["dist/<br/>(Static bundle)"]

    Source --> Vite
    Vite --> React
    Vite --> TW
    TW --> PostCSS
    React --> Dist
    PostCSS --> Dist
```

### 11.2 NPM Scripts

| Script          | Command         | Purpose                               |
|-----------------|-----------------|---------------------------------------|
| `npm run dev`   | `vite`          | Start dev server (localhost:5173)     |
| `npm run build` | `vite build`    | Production build to `dist/`           |
| `npm run preview` | `vite preview`| Preview production build locally      |
| `npm run lint`  | `eslint .`      | Run ESLint checks                     |

### 11.3 Vite Configuration

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    react(),       // React JSX transforms (Oxc)
    tailwindcss()  // Tailwind CSS processing
  ]
})
```

---

## 12. Deployment Architecture

### 12.1 Docker Multi-Stage Build

```mermaid
flowchart TD
    subgraph Stage1["Stage 1: Builder"]
        Node["Node 20 Alpine"]
        Install["npm ci"]
        Build["npm run build"]
        DistFiles["dist/ output"]

        Node --> Install --> Build --> DistFiles
    end

    subgraph Stage2["Stage 2: Runtime"]
        NginxBase["Nginx Alpine"]
        Copy["COPY dist/ → /usr/share/nginx/html"]
        Config["COPY nginx.conf"]
        Serve["Expose :80"]

        NginxBase --> Copy --> Config --> Serve
    end

    DistFiles -->|"Multi-stage COPY"| Copy
```

### 12.2 Nginx Configuration

```
                    ┌──────────────┐
                    │   Client     │
                    │  (Browser)   │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Nginx :80  │
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              │                         │
    ┌─────────▼─────────┐   ┌──────────▼──────────┐
    │  Static Files     │   │  /api/* Proxy        │
    │  (dist/)          │   │  → app:8080          │
    │                   │   │                      │
    │  try_files $uri   │   │  proxy_pass          │
    │  → /index.html    │   │  http://app:8080     │
    └───────────────────┘   └─────────────────────┘
```

**Key Nginx behaviors:**
- `/api/*` requests are proxied to the Spring Boot backend at `app:8080`
- All other requests serve static files from `dist/`
- SPA fallback: unmatched routes return `index.html` (enabling client-side routing if added later)
- Proxy headers forwarded: `Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`

### 12.3 Production Infrastructure

```mermaid
graph TD
    subgraph EC2["AWS EC2 Instance"]
        subgraph DockerCompose["Docker Compose"]
            FE["Frontend Container<br/>Nginx :80"]
            BE["Backend Container<br/>Spring Boot :8080"]
        end
    end

    subgraph GHCR["GitHub Container Registry"]
        Image["ghcr.io/.../frontend:latest"]
    end

    GHCR -->|"docker pull"| FE
    FE -->|"proxy /api/*"| BE
```

---

## 13. CI/CD Pipeline

### 13.1 Pipeline Overview

```mermaid
flowchart TD
    Push["Push to main"]
    PR["PR to main"]

    Push --> Lint
    PR --> Lint

    subgraph Lint["Job: Lint"]
        LintSetup["Setup Node 20"]
        LintRun["npm ci → npm run lint"]
        LintSetup --> LintRun
    end

    Push --> BuildPush
    Lint -->|"depends on"| BuildPush

    subgraph BuildPush["Job: Build & Push"]
        Login["Login to GHCR"]
        DockerBuild["Docker buildx build"]
        DockerPush["Push to GHCR<br/>:latest + :sha"]
        Login --> DockerBuild --> DockerPush
    end

    BuildPush --> Deploy

    subgraph Deploy["Job: Deploy to EC2"]
        SSH["SSH to EC2"]
        UpdateEnv["Upsert FRONTEND_IMAGE<br/>in .env"]
        Pull["docker pull image"]
        Up["docker compose up -d<br/>--no-deps frontend"]
        Prune["docker image prune"]

        SSH --> UpdateEnv --> Pull --> Up --> Prune
    end

    style PR fill:#f0f0f0,stroke:#999
    style Push fill:#e8f5e9,stroke:#4caf50
```

### 13.2 Trigger Rules

| Event           | Lint | Build & Push | Deploy |
|-----------------|------|--------------|--------|
| Push to `main`  | Yes  | Yes          | Yes    |
| PR to `main`    | Yes  | No           | No     |

### 13.3 Image Tagging

Each build produces two tags:
- `ghcr.io/<owner>/<repo>/frontend:latest`
- `ghcr.io/<owner>/<repo>/frontend:<commit-sha>`

---

## 14. Environment Configuration

### 14.1 Environment Variables

| Variable       | Scope     | Default              | Description                     |
|----------------|-----------|----------------------|---------------------------------|
| `VITE_API_URL` | Build-time| `""` (empty)         | Backend API base URL            |

### 14.2 Environment-Specific Behavior

```mermaid
flowchart TD
    Env{"Environment?"}
    Env -->|"Development"| Dev["VITE_API_URL = http://localhost:8080<br/>Vite dev server :5173<br/>Direct API calls to backend"]
    Env -->|"Production"| Prod["VITE_API_URL = '' (empty)<br/>Nginx serves static files :80<br/>Nginx proxies /api/* to app:8080"]
```

### 14.3 GitHub Actions Secrets

| Secret        | Purpose                          |
|---------------|----------------------------------|
| `GITHUB_TOKEN`| Auto-provided; GHCR login        |
| `EC2_HOST`    | EC2 instance hostname/IP         |
| `EC2_USER`    | SSH username                     |
| `EC2_SSH_KEY` | SSH private key for deployment   |

---

## 15. Security Considerations

### 15.1 Current State

| Area                    | Status           | Notes                                      |
|-------------------------|------------------|--------------------------------------------|
| Authentication          | Not implemented  | Public-facing; no user accounts            |
| Authorization           | Not implemented  | All endpoints open                         |
| CORS                    | Not applicable   | Nginx reverse proxy eliminates CORS issues |
| Input Validation        | Backend only     | Frontend sends raw URL to backend          |
| XSS Protection          | React default    | JSX auto-escapes rendered content          |
| HTTPS                   | Not configured   | Should be added via load balancer or cert  |
| Rate Limiting           | Not implemented  | Backend or Nginx should handle this        |
| Content Security Policy | Not configured   | Recommended for production                 |

### 15.2 Security Architecture

```mermaid
flowchart LR
    User["User Input<br/>(URL string)"]
    React["React<br/>(Auto-escapes)"]
    Nginx["Nginx<br/>(Reverse Proxy)"]
    Backend["Spring Boot<br/>(Validates + Sanitizes)"]

    User --> React
    React -->|"Same-origin request"| Nginx
    Nginx -->|"Internal network"| Backend
```

---

## 16. Future Improvements

### 16.1 Recommended Enhancements

| Area                    | Recommendation                                                       |
|-------------------------|----------------------------------------------------------------------|
| Component Decomposition | Extract Header, SearchForm, ProductCard, ConfidenceBadge, StatusPanel into separate components |
| Routing                 | Add React Router for multi-page support (history, wishlist, settings)|
| TypeScript              | Migrate to TypeScript for type safety (types already installed)      |
| Error Handling          | Add request timeouts, retry logic, AbortController on unmount        |
| Testing                 | Add Vitest + React Testing Library for unit/integration tests        |
| State Management        | Consider Zustand or React Query as complexity grows                  |
| Authentication          | Add OAuth/JWT for user accounts and saved comparisons                |
| PWA                     | Add service worker for offline support and caching                   |
| HTTPS                   | Add TLS termination at load balancer or Nginx level                  |
| Accessibility           | Add ARIA labels, keyboard navigation, screen reader support          |
| Analytics               | Add event tracking for search patterns and user behavior             |
| Caching                 | Cache API responses to avoid redundant scraping                      |

### 16.2 Suggested Component Decomposition

```mermaid
graph TD
    App["App.jsx"]
    App --> Header["Header.jsx"]
    App --> SearchForm["SearchForm.jsx"]
    App --> LoadingState["LoadingState.jsx"]
    App --> ResultsPanel["ResultsPanel.jsx"]

    ResultsPanel --> PrimaryCard["PrimaryProductCard.jsx"]
    ResultsPanel --> AltGrid["AlternativesGrid.jsx"]
    ResultsPanel --> StatusBar["StatusSidebar.jsx"]

    AltGrid --> ProductCard["ProductCard.jsx"]
    ProductCard --> ConfBadge["ConfidenceBadge.jsx"]
```

---

*This document describes the OmniKart UI frontend as of the initial release (v2.0 Beta). It should be updated as the architecture evolves.*
