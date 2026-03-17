# Application Tracker

A full-stack job application tracker with folder organization, analytics dashboard, and Google OAuth authentication.

## Tech Stack

**Frontend:** React 19, Vite 6, Tailwind CSS 4, Radix UI, TanStack Query/Table, Recharts, TipTap  
**Backend:** ASP.NET Core 8 (.NET 8)  
**Database:** SQL Server (Entity Framework Core 9)  
**Auth:** ASP.NET Identity + JWT (HttpOnly cookies) + Google OAuth 2.0

## Project Structure

```
application-tracker/
├── application-tracker.client/     # React SPA (Vite)
│   └── src/
│       ├── components/             # UI components, forms, sidebar, data table
│       ├── pages/                  # Route pages
│       ├── hooks/                  # Custom hooks
│       ├── context/                # Auth, theme, sheet, command providers
│       └── lib/                    # Utilities, auth interceptor
└── application-tracker.Server/     # ASP.NET Core API
    ├── Controllers/
    ├── Models/
    ├── Migrations/
    └── Helper/
```

## Features

- **Google Sign-In** via OAuth 2.0 auth-code flow
- **Folders** -- create, edit, delete; many-to-many relationship with applications
- **Job Applications** -- track company, position, URL, notes, and status (Wishlist, Applied, Interviewing, Offered, Rejected, Accepted, Withdrawn)
- **Dashboard** -- stats cards, stacked bar chart, radar chart, area chart
- **Data Table** -- filtering, sorting, pagination, CSV export
- **Command Menu** -- global keyboard shortcuts
- **Dark/Light Theme** -- toggle via `next-themes`
- **Rich Text Notes** -- TipTap editor

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (LTS recommended)
- SQL Server (local or remote)
- ASP.NET HTTPS dev certificate (`dotnet dev-certs https --trust`)

## Configuration

### Backend

Create `appsettings.Development.json` in `application-tracker.Server/` (gitignored):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "<your-sql-server-connection-string>"
  },
  "Authentication": {
    "Google": {
      "ClientId": "<google-client-id>",
      "ClientSecret": "<google-client-secret>"
    }
  },
  "Jwt": {
    "Issuer": "<issuer>",
    "Audience": "<audience>",
    "Key": "<signing-key>",
    "AccessTokenExpirationMinutes": 15,
    "RefreshTokenExpirationDays": 7
  },
  "Cors": {
    "AllowedOrigins": ["https://localhost:49600"]
  }
}
```

### Frontend

Create `.env` in `application-tracker.client/`:

```
VITE_GOOGLE_CLIENT_ID=<google-client-id>
```

## Getting Started

### Backend

```bash
cd application-tracker/application-tracker.Server
dotnet restore
dotnet ef database update
dotnet run
```

API runs at `https://localhost:7256`. Swagger UI available at `/swagger`.

### Frontend

```bash
cd application-tracker/application-tracker.client
npm install
npm run dev
```

Vite dev server runs at `https://localhost:49600` and proxies `/api` requests to the backend.

### Combined (SPA Proxy)

Running the backend via `dotnet run` with the default launch profile automatically starts the Vite dev server through `Microsoft.AspNetCore.SpaProxy`.

## Build

```bash
# Frontend
cd application-tracker/application-tracker.client
npm run build

# Backend
cd application-tracker/application-tracker.Server
dotnet build
```

## API Endpoints

All API routes are prefixed with `/api`. Key controllers:

| Controller | Base Route | Purpose |
|---|---|---|
| Auth | `/api/auth` | Login, signup, refresh, Google OAuth |
| Folder | `/api/folder` | CRUD for folders |
| JobApplication | `/api/jobapplication` | CRUD for job applications |
| Dashboard | `/api/dashboard` | Stats and chart data |

## Application Statuses

`Wishlist` | `Applied` | `Interviewing` | `Offered` | `Rejected` | `Accepted` | `Withdrawn`

## New User Defaults

On first sign-up, the system seeds default folders (Favorites, Archived) and sample applications.

## License

This project is not currently licensed.
