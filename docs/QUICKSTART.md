# Quick Start Guide

Get ResumeGen running in 5 minutes!

## Prerequisites
- Node.js 18+
- PostgreSQL database
- Google OAuth credentials

## Installation

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up Environment
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/resume_generator"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### 3. Initialize Database
```bash
pnpm db:generate
pnpm db:migrate
```

### 4. Start Development Server
```bash
pnpm dev
```

Open http://localhost:3000

## Google OAuth Setup (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Secret to `.env`

## Optional: Google Cloud Storage

Only needed for cloud PDF sharing feature.

1. Create GCS bucket
2. Create service account with Storage Admin role
3. Download JSON key
4. Base64 encode: `base64 -i key.json`
5. Add to `.env` as `GCP_SERVICE_ACCOUNT_KEY`

## Usage

1. **Sign In** - Click "Get Started with Google"
2. **Create Resume** - Fill in your information
3. **Preview** - View professional layout
4. **Export PDF** - Download for applications
5. **Share** - Upload to cloud (if configured)

## Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma Client
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open database GUI
pnpm db:push          # Push schema changes

# Other
pnpm lint             # Run linter
pnpm setup            # Run setup script
```

## Troubleshooting

**Database connection failed**
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Verify credentials

**OAuth error**
- Check redirect URI matches exactly
- Verify Client ID and Secret
- Check OAuth consent screen is configured

**PDF export not working**
- Check browser console for errors
- Try different browser
- Ensure html2canvas and jsPDF are installed

## Project Structure

```
app/
├── api/              # API routes
├── dashboard/        # Dashboard page
├── resume/           # Resume pages
└── page.tsx          # Landing page

components/
├── dashboard/        # Dashboard components
├── forms/            # Resume form
├── ui/               # UI components
└── viewer/           # Resume preview

lib/
├── prisma.ts         # Database client
├── storage.ts        # GCS utilities
└── validations/      # Zod schemas

prisma/
└── schema.prisma     # Database schema
```

## Next Steps

- Read [SETUP.md](SETUP.md) for detailed setup
- Check [FEATURES.md](FEATURES.md) for feature documentation
- Review [README.md](README.md) for full documentation

## Need Help?

- Check the documentation files
- Review error messages in console
- Open an issue on GitHub

---

**Tip**: The app works without Google Cloud Storage. PDF export will still function, only cloud sharing will be disabled.
