# ResumeGen - Professional Resume Builder

A full-stack Next.js application for creating, managing, and sharing multiple versions of professional resumes with PDF export and cloud storage integration.

## 🚀 Features

- **Google OAuth Authentication** - Secure sign-in with NextAuth.js
- **Multiple Resume Versions** - Create tailored resumes for different job roles
- **Rich Resume Editor** - Comprehensive form for all resume sections
- **PDF Export** - Generate professional PDFs with clean formatting
- **Cloud Storage** - Upload and share resumes via Google Cloud Storage
- **Responsive Design** - Beautiful UI built with Tailwind CSS and shadcn/ui
- **PostgreSQL Database** - Store resume data with Prisma ORM
- **Auto-save** - Never lose your work

## 🛠️ Tech Stack

- **Frontend**: Next.js 16.1 (App Router), React 19, Tailwind CSS 4
- **UI Components**: shadcn/ui, Radix UI, Lucide Icons
- **Authentication**: NextAuth.js 5 (beta) with Google OAuth
- **Database**: PostgreSQL with Prisma ORM 7.2 + Neon Adapter
- **Storage**: Google Cloud Storage
- **PDF Generation**: jsPDF + html2canvas
- **Form Management**: React Hook Form + Zod 4 validation
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js 18+ and pnpm/npm/yarn
- PostgreSQL database
- Google OAuth credentials
- Google Cloud Storage bucket (optional, for cloud sharing)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd resume-generator
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

   > **Note**: The project uses pnpm. Build scripts for Prisma are configured in `.npmrc` and `pnpm-workspace.yaml`.

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in the following variables in `.env`:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/resume_generator"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GCP_PROJECT_ID="your-gcp-project-id"
   GCP_BUCKET_NAME="your-bucket-name"
   GCP_SERVICE_ACCOUNT_KEY="base64-encoded-service-account-json"
   ```

4. **Set up the database**

   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

   Or use the setup script:

   ```bash
   pnpm setup
   ```

   > **Prisma 7**: This project uses Prisma 7 with the default client output location (`node_modules/@prisma/client`) for optimal Vercel deployment compatibility.

5. **Run the development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env` file

## ☁️ Setting Up Google Cloud Storage (Optional)

1. Create a bucket in Google Cloud Storage
2. Create a service account with Storage Admin role
3. Generate a JSON key for the service account
4. Base64 encode the JSON key: `base64 -i service-account.json`
5. Add the encoded key to `GCP_SERVICE_ACCOUNT_KEY` in `.env`

## 📁 Project Structure

```
resume-generator/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard page
│   ├── resume/           # Resume pages (new, edit, view)
│   ├── layout.tsx
│   └── page.tsx          # Landing page
├── components/
│   ├── dashboard/        # Dashboard components
│   ├── forms/            # Resume form components
│   ├── ui/               # shadcn/ui components
│   └── viewer/           # Resume preview component
├── lib/
│   ├── validations/      # Zod schemas
│   ├── prisma.ts         # Prisma client
│   ├── storage.ts        # GCS utilities
│   └── utils.ts          # Utility functions
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── prisma.config.ts      # Prisma 7 configuration
├── types/
│   └── resume.ts         # TypeScript types
├── auth.ts               # NextAuth configuration
└── middleware.ts         # Route protection
```

## 🎨 Resume Data Structure

Resumes are stored as JSON with the following structure:

- **Contact Information**: Name, title, email, phone, location, social links
- **Professional Summary**: Brief overview
- **Technical Skills**: Languages, frameworks, databases, tools, cloud platforms
- **Work Experience**: Job history with achievements and technologies
- **Projects**: Personal/professional projects
- **Education**: Academic background
- **Certifications**: Professional certifications

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database Hosting

- **Neon** (Recommended - project uses `@prisma/adapter-neon`)
- **Vercel Postgres**
- **Railway**
- **Supabase**

> **Important for Vercel Deployment**:
>
> - Ensure `DATABASE_URL` is set in Vercel environment variables
> - The `postinstall` script automatically runs `prisma generate` during builds
> - Prisma uses the default output location for serverless compatibility

## 📝 Usage

1. **Sign In** - Use Google OAuth to authenticate
2. **Create Resume** - Fill in your information using the comprehensive form
3. **Save Versions** - Create multiple versions for different job applications
4. **Preview** - View your resume in a professional layout
5. **Export PDF** - Download as PDF for job applications
6. **Share** - Upload to cloud and share via public link

## 🔒 Security

- All routes are protected with NextAuth middleware
- User data is isolated by userId
- Soft delete for resumes (isActive flag)
- Environment variables for sensitive data
- CORS and CSRF protection built-in

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🐛 Known Issues

- PDF generation may have layout issues with very long content
- GCS upload requires proper service account configuration
- Windows users may encounter Turbopack symlink errors locally (does not affect Vercel deployments)
- Type compatibility between Prisma 7 and `@auth/prisma-adapter` may show warnings (handled in code)

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Prisma, and Google Cloud
