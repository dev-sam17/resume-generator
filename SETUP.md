# Setup Guide for ResumeGen

This guide will walk you through setting up the Resume Generator application from scratch.

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- pnpm, npm, or yarn package manager
- PostgreSQL database (local or hosted)
- Google Cloud account (for OAuth and Storage)

## Step 1: Install Dependencies

```bash
pnpm install
```

## Step 2: Set Up PostgreSQL Database

### Option A: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database:
   ```sql
   CREATE DATABASE resume_generator;
   ```
3. Note your connection string: `postgresql://username:password@localhost:5432/resume_generator`

### Option B: Hosted Database (Recommended for Production)

Choose one of these providers:
- **Vercel Postgres**: Integrated with Vercel deployment
- **Supabase**: Free tier with 500MB storage
- **Railway**: Easy setup with PostgreSQL
- **Neon**: Serverless PostgreSQL

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your `.env` file with the following:

### Database Configuration
```env
DATABASE_URL="postgresql://user:password@localhost:5432/resume_generator?schema=public"
```

### NextAuth Configuration
```env
# Generate a secret key using: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Google OAuth Setup (Required)
```env
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Google Cloud Storage (Optional - for PDF sharing)
```env
GCP_PROJECT_ID="your-gcp-project-id"
GCP_BUCKET_NAME="your-bucket-name"
GCP_SERVICE_ACCOUNT_KEY="base64-encoded-service-account-json"
```

## Step 4: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted:
   - User Type: External
   - App name: ResumeGen
   - User support email: your-email@example.com
   - Developer contact: your-email@example.com
6. Create OAuth Client ID:
   - Application type: Web application
   - Name: ResumeGen
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy the **Client ID** and **Client Secret** to your `.env` file

## Step 5: Set Up Google Cloud Storage (Optional)

If you want to enable cloud PDF sharing:

1. In Google Cloud Console, go to **Cloud Storage** → **Buckets**
2. Click **Create Bucket**:
   - Name: `resume-generator-pdfs` (or your choice)
   - Location: Choose closest to your users
   - Storage class: Standard
   - Access control: Fine-grained
   - Public access: Allow (for public PDF links)
3. Create a Service Account:
   - Go to **IAM & Admin** → **Service Accounts**
   - Click **Create Service Account**
   - Name: `resume-storage`
   - Grant role: **Storage Admin**
   - Click **Done**
4. Generate JSON Key:
   - Click on the service account
   - Go to **Keys** tab
   - Click **Add Key** → **Create new key**
   - Choose **JSON** format
   - Download the key file
5. Encode the key to base64:
   - **Linux/Mac**: `base64 -i service-account.json`
   - **Windows PowerShell**: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("service-account.json"))`
6. Add the encoded string to `GCP_SERVICE_ACCOUNT_KEY` in `.env`

## Step 6: Initialize Database

Run Prisma migrations to create database tables:

```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations (creates tables)
pnpm prisma migrate dev --name init

# Optional: Open Prisma Studio to view data
pnpm prisma studio
```

## Step 7: Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 8: Test the Application

1. Click **Sign In** on the landing page
2. Authenticate with your Google account
3. You should be redirected to the dashboard
4. Click **Create New Resume**
5. Fill in your information
6. Save and view your resume
7. Test PDF export and cloud sharing (if configured)

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check firewall settings for hosted databases

### Google OAuth Errors
- Verify redirect URIs match exactly (including http/https)
- Check that OAuth consent screen is configured
- Ensure Client ID and Secret are correct

### PDF Export Not Working
- Check browser console for errors
- Ensure html2canvas and jsPDF are installed
- Try a different browser

### Cloud Upload Fails
- Verify GCS credentials are correct
- Check bucket permissions (must allow public access)
- Ensure service account has Storage Admin role

### TypeScript Errors
- Run `pnpm prisma generate` to regenerate Prisma Client
- Restart your IDE/editor
- Clear `.next` folder and rebuild

## Production Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables
4. Update `NEXTAUTH_URL` to your production domain
5. Update Google OAuth redirect URIs
6. Deploy

### Database Migration in Production

```bash
# Run migrations on production database
pnpm prisma migrate deploy
```

## Security Checklist

- [ ] Use strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Never commit `.env` file to version control
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Use read-only database user for queries if possible
- [ ] Regularly update dependencies

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Google Cloud Storage Documentation](https://cloud.google.com/storage/docs)

## Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Review error messages in the console
3. Check application logs
4. Open an issue on GitHub

---

**Note**: The application will work without Google Cloud Storage configured. PDF export will still function, but cloud sharing will be disabled.
