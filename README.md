# InvoXpress - Invoice Management Application

A responsive full-stack invoice app built with **Next.js 16 (App Router)** and **Tailwind CSS v4**.

## Live Features

- Create, read, update, and delete invoices
- Save as `Draft`, send as `Pending`, and mark `Pending` invoices as `Paid`
- Status-based filtering (`All`, `Draft`, `Pending`, `Paid`)
- Persistent light/dark mode with LocalStorage
- Persistent status filter with LocalStorage
- Backend persistence using a server-side JSON data store (`data/invoices.json`)
- Confirmation modal before deletion with keyboard support
- Responsive layout for mobile, tablet, and desktop
- Hover and focus-visible states on interactive elements

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS v4
- TypeScript
- Node.js file-based persistence via Next API routes

## Setup

1. Install dependencies

```bash
npm install
```

2. Run development server

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Architecture

- `src/app/page.tsx`: invoice list route
- `src/app/invoices/new/page.tsx`: create invoice route
- `src/app/invoices/[id]/page.tsx`: invoice detail route
- `src/app/invoices/[id]/edit/page.tsx`: edit invoice route
- `src/app/api/invoices/route.ts`: list + create endpoints
- `src/app/api/invoices/[id]/route.ts`: read + update + delete + mark paid endpoints
- `src/components/InvoiceForm.tsx`: invoice form + inline validation
- `src/components/ConfirmModal.tsx`: accessible modal with Esc close + focus trap
- `src/contexts/theme-context.tsx`: global theme state + LocalStorage persistence
- `src/lib/invoice-storage.ts`: persistence and domain logic
- `src/lib/validation.ts`: server-side validation rules

## Status Logic

- Draft can be edited and saved again as Draft
- Draft can be promoted to Pending from edit flow
- Pending can be marked as Paid
- Paid cannot be reverted to Draft (no UI action and server constraint)

## Validation Rules

Strict validation runs for non-draft saves:

- Client name required
- Valid email required
- Project description required
- Sender and client addresses required
- Invoice date required
- Payment terms must be positive
- At least one item required
- Item quantity and price must be positive

Draft saves are intentionally lenient to support partial work-in-progress invoices.

## Accessibility Notes

- Semantic HTML and labeled form fields
- All actions use `<button>` or `<a>` semantics appropriately
- Focus-visible states for keyboard users
- Deletion modal supports:
  - Focus trapping
  - `Esc` key close
  - Click-outside close
  - Keyboard navigation
- Color contrast chosen for readability in both light and dark themes

## Trade-offs

- Persistence uses JSON file storage for simplicity instead of a database
- Form validation is implemented manually without external schema libraries to keep bundle size small
- Data fetching is straightforward and app-scale oriented (no client caching library)

## Suggested Improvements

- Add authenticated multi-user support
- Move persistence to PostgreSQL or SQLite with an ORM
- Add optimistic UI and toast notifications
- Add automated tests (unit + e2e)
- Add currency and locale selection

## Submission

- Live URL: _Add deployed URL here_
- GitHub Repository: _Add repository URL here_
