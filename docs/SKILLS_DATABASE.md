# Skills Database System

## Overview

The resume generator now uses a **database-driven skill suggestion system** instead of hardcoded values. This provides:

- **Flexibility**: Add, update, or remove skills without code changes
- **Scalability**: Easily manage thousands of skills across multiple categories
- **Popularity Tracking**: Track which skills are most commonly used
- **Dynamic Updates**: Skills can be added by users or administrators

## Database Schema

### SkillCategory Model

Represents a category of skills (e.g., "Programming Languages", "Frameworks").

```prisma
model SkillCategory {
  id          String   @id @default(cuid())
  name        String   @unique
  key         String   @unique // e.g., "languages", "frameworks"
  description String?
  displayOrder Int     @default(0)
  isActive    Boolean  @default(true)
  skills      Skill[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Skill Model

Represents individual skills within a category.

```prisma
model Skill {
  id          String        @id @default(cuid())
  name        String
  categoryId  String
  category    SkillCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  isActive    Boolean       @default(true)
  usageCount  Int           @default(0) // Track popularity
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@unique([name, categoryId])
}
```

## Setup Instructions

### 1. Run Database Migration

After pulling the latest changes, run the migration to create the new tables:

```bash
npm run db:migrate
```

This will create the `SkillCategory` and `Skill` tables in your database.

### 2. Seed the Database

Populate the database with initial skill data:

```bash
npm run db:seed
```

This will:

- Clear existing skill data (if any)
- Create 11 skill categories
- Add 500+ skills across all categories

The seed script includes skills from:

- Programming Languages (40+ skills)
- Frameworks & Libraries (80+ skills)
- Databases & ORMs (50+ skills)
- Tools & Technologies (100+ skills)
- Cloud Platforms (40+ skills)
- Methodologies & Practices (50+ skills)
- Data Science & ML (20+ skills)
- Blockchain (14+ skills)
- Security (13+ skills)
- Mobile Development (12+ skills)
- UI/UX Design (12+ skills)

### 3. Verify Setup

Check that skills were seeded correctly:

```bash
npm run db:studio
```

Navigate to the `SkillCategory` and `Skill` tables to verify the data.

## API Endpoints

### GET /api/skills

Fetch all skill categories with their skills.

**Response:**

```json
{
  "categories": [
    {
      "id": "clx...",
      "name": "Programming Languages",
      "key": "languages",
      "description": "Programming and scripting languages",
      "skills": ["JavaScript", "TypeScript", "Python", ...],
      "count": 46
    },
    ...
  ]
}
```

### GET /api/skills?category=languages

Fetch skills for a specific category.

**Query Parameters:**

- `category` - The category key (e.g., "languages", "frameworks")

**Response:**

```json
{
  "skills": ["JavaScript", "TypeScript", "Python", ...],
  "count": 46
}
```

### POST /api/skills/add

Add a new skill to a category (requires authentication).

**Request Body:**

```json
{
  "skillName": "Deno",
  "categoryKey": "frameworks"
}
```

**Response:**

```json
{
  "skill": {
    "id": "clx...",
    "name": "Deno",
    "categoryId": "clx...",
    "isActive": true,
    "usageCount": 0
  },
  "message": "Skill added successfully"
}
```

## Adding New Skills

### Via Database

You can add skills directly through Prisma Studio:

```bash
npm run db:studio
```

1. Navigate to the `Skill` table
2. Click "Add record"
3. Fill in the skill name and select a category
4. Save

### Via API

Send a POST request to `/api/skills/add`:

```javascript
const response = await fetch("/api/skills/add", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    skillName: "New Skill",
    categoryKey: "languages",
  }),
});
```

### Via Seed Script

Edit `prisma/seed.ts` and add skills to the appropriate category array, then run:

```bash
npm run db:seed
```

## Managing Categories

### Add a New Category

1. Open Prisma Studio: `npm run db:studio`
2. Navigate to `SkillCategory`
3. Add a new record with:

   - `name`: Display name (e.g., "DevOps Tools")
   - `key`: Unique identifier (e.g., "devops")
   - `description`: Optional description
   - `displayOrder`: Order in which it appears
   - `isActive`: Set to `true`

4. Update the frontend component to display the new category in `components/forms/sections/SkillsSection.tsx`

### Deactivate a Category

Instead of deleting, set `isActive` to `false`. This preserves data while hiding it from users.

## Popularity Tracking

The `usageCount` field tracks how many times a skill has been used. This can be used to:

- Sort skills by popularity
- Identify trending skills
- Provide better suggestions

To implement usage tracking, update the resume save logic to increment `usageCount` for selected skills.

## Migration from Hardcoded Skills

The old `lib/skillSuggestions.ts` file is now deprecated but kept for reference. All skills have been migrated to the database through the seed script.

To completely remove the old system:

1. Delete `lib/skillSuggestions.ts`
2. Ensure all components are using the API endpoints
3. Test thoroughly

## Troubleshooting

### Skills not loading

1. Check that the migration ran successfully
2. Verify the database was seeded: `npm run db:studio`
3. Check browser console for API errors
4. Verify the API route is accessible: `curl http://localhost:3000/api/skills`

### Duplicate skills

The database enforces uniqueness per category. If you try to add a duplicate skill, you'll get a 409 error.

### Performance

With proper indexing, the system can handle thousands of skills efficiently. The API includes:

- Indexes on `categoryId`, `isActive`, and `usageCount`
- Efficient queries with proper `select` statements
- Sorting by popularity and name

## Future Enhancements

Potential improvements to consider:

1. **Admin Panel**: Create an admin interface for managing skills
2. **Bulk Import**: Add CSV/JSON import functionality
3. **Skill Synonyms**: Map similar skills (e.g., "JS" → "JavaScript")
4. **Skill Relationships**: Link related skills or prerequisites
5. **User Suggestions**: Allow users to suggest new skills for approval
6. **Analytics**: Track skill trends and popularity over time
7. **Caching**: Implement Redis caching for frequently accessed skills
8. **Search**: Add full-text search for skills
