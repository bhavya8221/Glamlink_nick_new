# Glamlink Web App - Development Guide

This document provides guidance to Claude Code when working with the Glamlink beauty marketplace application.

## Project Overview

Glamlink is a comprehensive multi-tenant beauty marketplace platform built with Next.js 15. It empowers beauty entrepreneurs to create and manage their own digital storefronts, connect with certified beauty professionals, and leverage AI-powered tools to grow their businesses.

**Core Concept:**
Each authenticated user (except the super admin) automatically gets their own beauty brand upon signup. They can then manage all aspects of their brand through a sophisticated admin panel, while customers browse and interact with brands through public-facing pages.

**Key Features:**

- Multi-tenant architecture with complete brand isolation
- AI-powered content generation for products, providers, reviews, and more
- Comprehensive admin panel with role-based access control
- Professional detail pages for products, providers, and transformations
- AI-powered business growth tools (brainstorming, research, analysis)
- Optimized nested document structure for performance (1 read vs 6+)
- AI beauty analysis tool for personalized recommendations
- Social features for brand discovery and engagement

## Latest Updates (2025-07-11)

### Profile Management System

We've introduced a comprehensive profile management system for brand owners:

#### Features:

1. **Profile Navigation Layout** (`/app/profile/layout.tsx`)

   - Persistent sidebar navigation with collapsible sections
   - Mobile-responsive with slide-out menu
   - Automatic route highlighting with exact matching
   - Organized sections: Get Started, Dashboard, Brand Management

2. **Brand Management Pages** (`/profile/brand/*`)

   - **Products Page**: Full CRUD operations with AI generation
   - **Providers Page**: Create, edit, delete functionality
   - **Training Page**: Date picker integration for session scheduling
   - **Reviews Page**: Create/delete with testing mode warning
   - **Brainstorm Page**: AI-powered business ideas and research

3. **Enhanced Questionnaire System**
   - **File Upload**: Import requirements.txt for quick setup
   - **Sample Download**: Get template file for easy onboarding
   - **Progress Saving**: Auto-save questionnaire to user profile
   - **Existing Data**: Toggle between saved and fresh data
   - **Generation Progress**: Real-time step-by-step feedback dialog

#### Navigation Improvements:

- Fixed "Brand Profile" always appearing active (exact route matching)
- Removed Gallery link from profile navigation
- Auto-expand parent sections based on current route

### AI-Powered Image Generation

Introduced a comprehensive image generation service:

#### Features:

1. **DALL-E 3 Integration** (`/lib/services/ai/imageGeneratorService.ts`)

   - Context-aware prompt generation for beauty content
   - Support for products, providers, before/after, training images
   - Automatic fallback to high-quality Unsplash images
   - Batch generation capabilities

2. **Smart Prompt Creation**
   - Product photography with multiple angles
   - Professional headshots for providers
   - Before/after treatment comparisons
   - Training session photography

### Date Management System

Standardized date handling across the application:

#### Implementation:

1. **Storage Format**: YYYY-MM-DD in database
2. **Display Format**: "Feb 2, 2024" in UI
3. **Date Picker**: Native HTML5 date input
4. **Consistent Formatting**: `formatDate()` utility function

### Previous Updates (2025-07-10)

### AI-Powered Brainstorming & Research Tools

We've added comprehensive brainstorming functionality to help users grow their brands:

#### Features:

1. **Brainstorm Ideas Generation**

   - Generate 1-10 AI-powered ideas per request
   - Focus areas: Product Development, Certifications, Marketing, Expansion, Innovation
   - Each idea includes:
     - Detailed description and benefits
     - Action items with step-by-step guidance
     - Estimated timeframe and investment
     - Potential ROI analysis
     - Difficulty level (easy/medium/hard)
     - Required resources

2. **Topic Research**

   - Research any beauty industry topic
   - Get comprehensive analysis including:
     - Executive summary
     - Key points and insights
     - Opportunities and challenges
     - Actionable next steps
     - Curated resources with links

3. **Implementation Details**
   - New `brainstorm` tab in admin panel (for brand owners only)
   - `BrainstormIdea` interface in content generator service
   - API endpoints: `/api/ai/generate-brainstorm` and `/api/ai/research-topic`
   - Ideas stored in brand document as `brainstormIdeas` array
   - Full CRUD operations for idea management

#### Components:

- `BrainstormTab`: Main interface for brainstorming and research
- `BrainstormModal`: Configuration modal for idea generation

### Questionnaire File Upload System

Enhanced the Brand Setup Wizard with file import capabilities:

#### Features:

1. **Requirements.txt Parser** (`/lib/admin/utils/requirementsParser.ts`)

   - Parse structured text files for questionnaire data
   - Support for all questionnaire fields
   - Validation and error reporting
   - Clear format documentation

2. **Upload Interface**

   - Drag-and-drop or click to upload
   - Real-time parsing feedback
   - Error display with specific issues
   - Sample file download button

3. **Data Management**
   - Toggle between uploaded and saved data
   - Merge capabilities for partial uploads
   - Progress indicator during generation

## Previous Updates (2025-07-10)

### Database Structure Change - Nested Brand Documents

We've completely restructured the database from a collection-based approach to a nested document structure:

#### Old Structure (Multiple Collections):

```
brands/
  └── glamour_beauty_co (document)
products/
  └── prod_1 (document with brandId: "glamour_beauty_co")
certifiedProviders/
  └── prov_1 (document with brandId: "glamour_beauty_co")
```

#### New Structure (Single Brand Document):

```
brands/
  └── glamour_beauty_co (document)
      ├── name: "Glamour Beauty Co."
      ├── products: [{ id: "prod_1", name: "...", ... }]
      ├── certifiedProviders: [{ id: "prov_1", name: "...", ... }]
      ├── beforeAfters: [...]
      ├── trainingPrograms: [...]
      └── reviews: [...]
```

#### Benefits:

- **Fewer database reads**: 1 read instead of 6+ reads
- **Data consistency**: All brand data in one place
- **Atomic updates**: All changes happen in one document
- **User isolation**: Each user sees only their brand's data

#### Implementation Details:

1. **Firestore Service**: Added helper methods for nested arrays:

   - `addToBrandArray()`: Add item to a brand's array
   - `updateInBrandArray()`: Update item in a brand's array
   - `removeFromBrandArray()`: Remove item from a brand's array

2. **Admin Tabs**: All tabs now fetch from the user's brand document:

   - Products, Providers, BeforeAfter, Training, Reviews tabs all use `brand.arrayName`
   - Overview tab counts array lengths from the brand document

3. **Database Initialization**: "Initialize Database" now:
   - Creates one brand document with all nested data
   - Associates the brand with melanie@glamlink.net user

### AI-Powered Content Generation

We've integrated AI assistance into the admin panel to help users quickly populate their brands with professional content:

#### Features:

1. **AI Content Generator Service** (`/lib/services/ai/contentGeneratorService.ts`)

   - Uses OpenAI GPT-4 for high-quality content generation
   - Generates products, providers, training programs, reviews, and before/after examples
   - Context-aware: uses brand name, tagline, and mission for consistent content
   - Falls back to high-quality mock data if API key not configured

2. **Reusable AI Generator Modal** (`/lib/admin/components/AIGeneratorModal.tsx`)

   - Universal modal for all content types
   - Customizable generation options (count, category, price range)
   - Preview generated items before saving
   - Select/deselect individual items
   - Loading states and error handling

3. **API Endpoints**:

   - `/api/ai/generate-products` - Generate product listings
   - `/api/ai/generate-providers` - Generate provider profiles
   - `/api/ai/generate-training` - Generate training programs
   - `/api/ai/generate-reviews` - Generate customer reviews
   - `/api/ai/generate-beforeafter` - Generate transformation examples

4. **Admin Tab Integration**:
   - Purple "Generate with AI" button added to each admin tab
   - Generates contextually appropriate content for each section
   - Seamlessly adds generated content to the brand's nested arrays

#### Usage:

1. Click "Generate with AI" button in any admin tab
2. Configure generation options (optional)
3. Click "Generate" to create content
4. Review and select items to keep
5. Click "Save Selected" to add to your brand

#### Configuration:

- Set `OPENAI_API_KEY` in `.env.local` for real AI generation
- Without API key, uses high-quality mock data

### Individual Detail Pages for Brand Content

We've created comprehensive detail pages for all brand content types:

#### 1. **Product Detail Pages** (`/brand/[id]/products/[productId]`)

Features:

- Large product image gallery with thumbnails
- Detailed description, ingredients, benefits, and usage
- Price with discount display
- Quantity selector and add to cart button
- Customer reviews for the specific product
- Related products carousel
- Social sharing buttons

#### 2. **Provider Profile Pages** (`/brand/[id]/providers/[providerId]`)

Features:

- Professional profile with photo and credentials
- Certification level and verification badges
- About section with background and services
- Portfolio tab showing before/after work
- Reviews tab with client testimonials
- Contact information and booking buttons
- Location and rating display

#### 3. **Before/After Detail Pages** (`/brand/[id]/gallery/[transformationId]`)

Features:

- Interactive before/after slider comparison
- Treatment details and timeline
- Products used with links to product pages
- Provider information if applicable
- Call-to-action for booking consultation
- Social sharing for transformations

#### 4. **Shared Components**

Created reusable components for consistent UI:

- `BreadcrumbNav`: Navigation trail showing page hierarchy
- `ShareButtons`: Social media sharing (Facebook, Twitter, Pinterest, Copy Link)
- `BackToListButton`: Consistent back navigation

#### Navigation Updates

- All grid components now link to their respective detail pages
- `useBrand` hook updated with proper routing functions
- Seamless navigation between related content

## Recent Updates (2025-07-10)

### 1. Multi-Brand Architecture

- **Brand Listing Page** (`/brand`): Shows all brands as clickable cards
- **Individual Brand Pages** (`/brand/[id]`): Displays specific brand with all their content
- **Brand Creation**: Each user automatically gets a brand when they sign up

### 2. User Role System

We have two types of users:

#### Super Admin (admin@glamlink.com)

- Only sees the **Settings** tab in admin panel
- Can initialize/manage the database
- Cannot create or manage brands/products

#### Brand Owners (all other authenticated users)

- See all tabs EXCEPT Settings: Overview, Profile, Products, Providers, Before/After, Training, Reviews, Brainstorm
- Have a **Profile** tab to manage their brand information
- Each user has one brand associated with their account
- Can manage all content for their brand

### 3. Authentication & Navigation

- **ADMIN link**: Now shows for ALL authenticated users (not just admins)
- Login required to access admin panel
- Navigation automatically adjusts based on authentication status

### 4. Database Strategy

- **NO MOCK DATA FALLBACK**: All components show real Firestore data only
- Empty states are shown when no data exists
- Data is only populated through:
  - "Initialize Database" button (super admin only)
  - User actions (creating products, providers, etc.)
  - AI generation tools

### 5. Key Components

#### ProfileTab (`/lib/admin/components/ProfileTab.tsx`)

- Brand owners edit their brand profile
- Automatically creates brand if user doesn't have one
- Fields: name, tagline, mission, description, social links, etc.

#### AllBrandsPage (`/lib/pages/brand/components/AllBrandsPage.tsx`)

- Displays all brands in a grid layout
- Shows brand stats (products, providers)
- Links to individual brand pages

#### Dynamic Admin Tabs (`/lib/admin/config.ts`)

- `getAdminTabsForUser(email)` function determines visible tabs
- Super admin: Settings only
- Brand owners: All tabs except Settings

## Architecture Patterns

### Page Structure

```
/                   → Landing page
/brand              → All brands listing (public marketplace)
/brand/[id]         → Individual brand showcase page
/brand/[id]/products/[productId]  → Product detail page
/brand/[id]/providers/[providerId] → Provider profile page
/brand/[id]/gallery/[transformationId] → Transformation detail page
/admin              → Admin panel (requires authentication)
/login              → User authentication
/signup             → New user registration
/profile            → User profile dashboard
├── /profile/dashboard     → Analytics and overview
├── /profile/brand         → Brand profile management
├── /profile/brand/products → Product catalog management
├── /profile/brand/providers → Provider directory management
├── /profile/brand/training → Training programs management
├── /profile/brand/reviews  → Customer reviews management
└── /profile/brand/brainstorm → AI brainstorming tools
/image-analysis     → AI-powered beauty analysis tool
```

### Data Flow

1. User signs up → Brand created automatically
2. User logs in → Redirected to admin panel
3. Brand owner edits in Profile tab → Updates their brand
4. Public views `/brand` → Sees all brands
5. Public views `/brand/[id]` → Sees specific brand

### State Management

- Redux for global state (auth, brand data)
- Each page module has its own slice
- Authentication state determines UI visibility
- Brand association stored in user profile

## Technical Architecture

### Frontend Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **State Management**: Redux Toolkit with async thunks
- **Styling**: Tailwind CSS, Material-UI v6, Framer Motion
- **UI Components**: Custom component library with consistent patterns

### Backend Stack

- **Authentication**: Firebase Auth with email/password and Google OAuth
- **Database**: Firebase Firestore with optimized nested documents
- **Storage**: Firebase Storage for images and media
- **AI Integration**: OpenAI GPT-4 for content generation
- **API Pattern**: RESTful endpoints with consistent response format

### Development Tools

- **Package Manager**: npm
- **Build Tool**: Next.js with Turbopack
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript compiler

## Complete Feature Set

### Admin Panel Tabs

#### 1. **Overview Tab** (All brand owners)

- Dashboard with key metrics
- Total counts for products, providers, transformations, training, reviews
- Quick access to other sections

#### 2. **Profile Tab** (All brand owners)

- Edit brand information (name, tagline, mission, description)
- Social media links management
- Brand images (profile and cover)
- Auto-creates brand for new users

#### 3. **Products Tab** (All brand owners)

- Full product catalog management
- AI-powered product generation
- Product details: name, price, category, ingredients, benefits
- Inventory tracking
- Spotlight products feature

#### 4. **Providers Tab** (All brand owners)

- Certified provider directory
- AI-powered provider profile generation
- Certification levels (bronze, silver, gold, platinum)
- Ratings and reviews
- Location and specialty tracking

#### 5. **Before/After Tab** (All brand owners)

- Transformation gallery management
- AI-powered transformation generation
- Treatment type and duration
- Associated products and providers
- Visual comparison features

#### 6. **Training Tab** (All brand owners)

- Professional training program management
- AI-powered program generation
- Certification offerings
- Enrollment tracking
- Session scheduling

#### 7. **Reviews Tab** (All brand owners)

- Customer review management
- AI-powered review generation
- Rating and sentiment tracking
- Verified purchase badges
- Helpful vote counts

#### 8. **Brainstorm Tab** (All brand owners)

- AI-powered idea generation
- Topic research functionality
- Idea categorization and filtering
- Action item tracking
- Resource recommendations

#### 9. **Settings Tab** (Super admin only)

- Database initialization
- System configuration
- User management

### Public-Facing Features

#### 1. **Brand Listing Page** (`/brand`)

- Grid view of all brands
- Brand cards with key stats
- Click to view individual brands

#### 2. **Individual Brand Pages** (`/brand/[id]`)

- Complete brand showcase
- Product catalog with filtering
- Provider directory
- Transformation gallery
- Training programs
- Customer reviews

#### 3. **Detail Pages**

- **Product Details** (`/brand/[id]/products/[productId]`)
  - Image gallery
  - Detailed descriptions
  - Ingredient lists
  - Customer reviews
  - Related products
- **Provider Profiles** (`/brand/[id]/providers/[providerId]`)
  - Professional credentials
  - Portfolio showcase
  - Client reviews
  - Booking information
- **Transformation Details** (`/brand/[id]/gallery/[transformationId]`)
  - Interactive before/after slider
  - Treatment timeline
  - Products used
  - Provider information

### Database Structure

```typescript
Brand {
  id: string
  name: string
  tagline: string
  mission: string
  products: Product[]
  certifiedProviders: CertifiedProvider[]
  beforeAfters: BeforeAfter[]
  trainingPrograms: TrainingProgram[]
  reviews: Review[]
  brainstormIdeas: BrainstormIdea[]
}
```

### AI Integration

- OpenAI GPT-4 for content generation
- Fallback to high-quality mock data
- Context-aware generation using brand information
- Batch generation capabilities

### Authentication & Authorization

- Firebase Authentication
- Role-based access control
- Two user types:
  - Super Admin (admin@glamlink.com) - Settings only
  - Brand Owners (all others) - Full brand management

## Firebase Authentication in Next.js App Router

### Overview

This application uses Firebase's recommended approach for Next.js App Router: **FirebaseServerApp** with session cookies for server-side authentication. This approach allows API routes to perform authenticated operations while respecting Firestore security rules.

**IMPORTANT**: Do NOT use Firebase Admin SDK for user-specific operations. Admin SDK requires service account credentials and is meant for privileged operations, not user context operations.

### Authentication Architecture

#### 1. Client-Side Authentication Flow

```
User logs in → Firebase Auth → ID Token generated →
AuthProvider detects change → Sends token to /api/auth/session →
Server sets httpOnly cookie → All API requests authenticated
```

#### 2. Server-Side Authentication Flow

```
API Route called → getAuthenticatedAppForUser() →
Reads __session cookie → Creates FirebaseServerApp →
Performs operations with user's permissions
```

### Key Implementation Files

#### 1. **Firebase Configuration** (`/lib/config/firebase.ts`)

```typescript
// MUST export firebaseConfig for serverApp to use
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  // ... other config
};
```

#### 2. **AuthProvider Component** (`/lib/auth/components/AuthProvider.tsx`)

- Listens for Firebase auth state changes
- Automatically manages session cookies
- Updates Redux auth state
- MUST be wrapped around entire app in providers.tsx

#### 3. **Session Cookie API** (`/app/api/auth/session/route.ts`)

- POST: Sets \_\_session cookie with ID token
- DELETE: Clears cookie on logout
- Uses httpOnly cookies for security

#### 4. **Server App Helper** (`/lib/firebase/serverApp.ts`)

```typescript
export async function getAuthenticatedAppForUser() {
  const authIdToken = (await cookies()).get("__session")?.value;

  if (!authIdToken) {
    return { firebaseServerApp: null, currentUser: null, db: null };
  }

  const firebaseServerApp = initializeServerApp(firebaseConfig, {
    authIdToken,
  });

  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  return {
    firebaseServerApp,
    currentUser: auth.currentUser,
    db: getFirestore(firebaseServerApp),
  };
}
```

### Setting Up Authentication (Step-by-Step)

#### Prerequisites

1. Firebase project created
2. Authentication enabled in Firebase Console
3. Firestore security rules configured
4. Environment variables set

#### Implementation Steps

1. **Export Firebase Config**

   ```typescript
   // In /lib/config/firebase.ts
   export const firebaseConfig = {
     /* ... */
   };
   ```

2. **Create Cookie Utilities**

   ```typescript
   // In /lib/utils/cookies.ts
   export async function setCookie(name: string, value: string) {
     (await cookies()).set(name, value, {
       httpOnly: true,
       secure: process.env.NODE_ENV === "production",
       sameSite: "lax",
       maxAge: 60 * 60, // 1 hour
     });
   }
   ```

3. **Add AuthProvider to App**

   ```typescript
   // In app/providers.tsx
   <Provider store={store}>
     <AuthProvider>{children}</AuthProvider>
   </Provider>
   ```

4. **Create Session Endpoint**

   ```typescript
   // In /app/api/auth/session/route.ts
   export async function POST(request: NextRequest) {
     const { idToken } = await request.json();
     await setCookie("__session", idToken);
     return NextResponse.json({ success: true });
   }
   ```

5. **Use in API Routes**

   ```typescript
   // In any API route
   const { db, currentUser } = await getAuthenticatedAppForUser();

   if (!currentUser) {
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }

   // Perform Firestore operations with user context
   await setDoc(doc(db, "users", currentUser.uid), data);
   ```

### Common Pitfalls & Solutions

#### ❌ DON'T: Use Firebase Admin SDK for user operations

```typescript
// WRONG - This will cause "INTERNAL" errors
import * as admin from "firebase-admin";
adminApp = admin.initializeApp({
  /* ... */
});
```

#### ✅ DO: Use FirebaseServerApp with cookies

```typescript
// CORRECT
const firebaseServerApp = initializeServerApp(firebaseConfig, {
  authIdToken,
});
```

#### ❌ DON'T: Pass ID tokens in request headers manually

```typescript
// WRONG - Prone to errors
headers: { 'Authorization': `Bearer ${idToken}` }
```

#### ✅ DO: Let AuthProvider manage cookies automatically

```typescript
// CORRECT - Cookies set automatically
// No manual token handling needed
```

#### ❌ DON'T: Try to access auth.currentUser on server without ServerApp

```typescript
// WRONG - Will always be null
import { auth } from "@/lib/config/firebase";
const user = auth.currentUser; // Always null on server
```

#### ✅ DO: Use getAuthenticatedAppForUser()

```typescript
// CORRECT
const { currentUser } = await getAuthenticatedAppForUser();
```

### Troubleshooting Guide

#### "Unauthorized" errors in API routes

1. Check if user is logged in on client
2. Verify AuthProvider is in providers.tsx
3. Check if \_\_session cookie exists in browser DevTools
4. Ensure session endpoint is working

#### "Cannot read properties of undefined" errors

- Usually means trying to use Admin SDK
- Remove all firebase-admin imports
- Use FirebaseServerApp instead

#### Cookie not being set

1. Check browser console for errors
2. Verify /api/auth/session endpoint exists
3. Ensure AuthProvider wraps your app
4. Check cookie settings match your environment

#### Firestore permission denied

1. Check Firestore rules allow the operation
2. Verify currentUser.uid matches document ID
3. Ensure using authenticated Firestore instance from ServerApp

### Example: Authenticated API Route

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { doc, setDoc } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated app
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Save with user's permissions
    await setDoc(
      doc(db, "users", currentUser.uid),
      {
        ...data,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

### Security Considerations

1. **Session cookies are httpOnly** - Can't be accessed by JavaScript
2. **Cookies expire after 1 hour** - Matches Firebase token expiration
3. **Operations use user's permissions** - Respects Firestore rules
4. **No service account needed** - Reduces security risk

### Migration from Firebase Admin SDK

If you're migrating from Admin SDK:

1. Remove `firebase-admin` from package.json
2. Delete `/lib/config/firebase-admin.ts`
3. Remove service account JSON files
4. Update all API routes to use `getAuthenticatedAppForUser()`
5. Test all authenticated operations

## Application Flow

### User Journey

#### 1. **New User Onboarding**

```
User signs up → Brand created automatically → Redirected to admin panel →
Profile tab selected → User customizes brand → Starts adding content
```

#### 2. **Brand Management Flow**

```
Brand owner logs in → Admin panel → Uses AI to generate content →
Customizes generated items → Publishes to public brand page
```

#### 3. **Customer Discovery Flow**

```
Visitor browses /brand → Clicks on brand → Views products/services →
Explores detail pages → Books appointments or purchases
```

### Data Flow Architecture

1. **Authentication Layer**

   - Firebase Auth handles user sessions
   - Auth state stored in Redux
   - Protected routes via middleware

2. **Data Layer**

   - Single Firestore document per brand
   - All brand data nested in one document
   - Atomic updates for consistency

3. **AI Integration Layer**

   - API routes handle AI requests
   - OpenAI for generation
   - Fallback to mock data

4. **Presentation Layer**
   - Server-side rendering for SEO
   - Client-side navigation
   - Optimistic UI updates

## Development Timeline & Key Milestones

### Phase 1: Database Restructuring

- **Problem**: Users were seeing data from other brands
- **Solution**: Moved from collection-based to nested document structure
- **Result**: Complete data isolation, improved performance (1 read vs 6+ reads)

### Phase 2: AI Content Generation

- **Goal**: Help users quickly populate their brands with professional content
- **Implementation**:
  - Created comprehensive AI service with OpenAI integration
  - Built reusable AI Generator Modal
  - Added "Generate with AI" buttons to all admin tabs
- **Result**: Users can generate products, providers, reviews, etc. in seconds

### Phase 3: Individual Detail Pages

- **Goal**: Provide detailed views for all brand content
- **Implementation**:
  - Product detail pages with galleries and reviews
  - Provider profiles with portfolios and credentials
  - Before/after pages with interactive sliders
- **Result**: Professional, e-commerce quality detail pages

### Phase 4: Brainstorming & Research Tools

- **Goal**: Help users grow their brands with AI-powered insights
- **Implementation**:
  - Brainstorm tab for idea generation
  - Topic research functionality
  - Categorized ideas with action items
- **Result**: Users can generate actionable growth strategies

## Commands

### Development

```bash
cd web/web_app
npm run dev      # Start development server on http://localhost:3000
```

### Production

```bash
cd web/web_app
npm run build    # Build for production
npm run start    # Run production server
```

### Code Quality

```bash
cd web/web_app
npm run lint     # Run ESLint
npm run typecheck # Run TypeScript type checking
```

### Testing

```bash
# No test commands configured yet
# Future: npm run test
```

### Common Development Tasks

```bash
# Download sample questionnaire file
curl http://localhost:3000/sample-requirements.txt -o requirements.txt

# Test file upload
# Navigate to /profile and click "Brand Setup Wizard"
# Upload the requirements.txt file
```

### Common Development Tasks

```bash
# Download sample questionnaire file
curl http://localhost:3000/sample-requirements.txt -o requirements.txt

# Test file upload
# Navigate to /profile and click "Brand Setup Wizard"
# Upload the requirements.txt file
```

## Directory Structure

```
web/web_app/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── ai/             # AI generation endpoints
│   │   ├── brand/          # Brand data endpoints
│   │   └── image-analysis/ # Beauty analysis endpoint
│   ├── admin/              # Admin panel page
│   ├── brand/              # Brand pages
│   ├── login/              # Authentication pages
│   ├── signup/
│   ├── profile/            # User profile
│   └── image-analysis/     # AI beauty analysis
├── lib/                     # Core application code
│   ├── admin/              # Admin panel components
│   │   └── components/     # Tab components
│   ├── auth/               # Authentication logic
│   ├── components/         # Shared components
│   ├── config/             # Configuration files
│   ├── pages/              # Page-specific modules
│   │   └── brand/          # Brand page components
│   └── services/           # Service layers
│       ├── ai/             # AI integration
│       └── firebase/       # Firebase services
├── public/                  # Static assets
├── store/                   # Redux store setup
└── middleware.ts           # Next.js middleware
```

## Best Practices

### State Management

- Use Redux for global auth state
- Component state for UI interactions
- Firestore for persistent data
- No prop drilling - use hooks

### AI Integration

- Always provide context (brand name, tagline, mission)
- Include specific structure in prompts
- Implement mock data fallbacks
- Handle API errors gracefully

### Performance

- Use nested documents to minimize reads
- Implement loading states everywhere
- Lazy load images with Next.js Image
- Cache AI responses when possible

### Security

- Role-based access control
- Data isolation by brand
- Input validation on all forms
- Sanitize AI-generated content

### Component Patterns

- Single props pattern for all components
- Centralized types in config.ts files
- Consistent error handling
- Loading states for async operations
- Date formatting utilities for consistent display
- File upload with real-time validation
- Progress dialogs for long-running operations
- Date formatting utilities for consistent display
- File upload with real-time validation
- Progress dialogs for long-running operations

## Environment Variables

Ensure these are set in `.env.local`:

```
# Firebase Configuration (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# OpenAI Configuration (Optional - will use mock data if not set)
OPENAI_API_KEY=

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Common Tasks

### Adding a New Admin Tab

1. Add to `AdminTab` type in `/lib/admin/config.ts`
2. Add to `ALL_ADMIN_TABS` array with icon and description
3. Create component in `/lib/admin/components/`
4. Add case in admin page's `renderTabContent()`
5. Update Firestore service if new data type needed

### Creating New AI Generation

1. Add interface to `contentGeneratorService.ts`
2. Create generation method with OpenAI prompt
3. Add mock data fallback method
4. Create API endpoint in `/app/api/ai/`
5. Integrate with admin tab component

### Adding New Detail Page

1. Create component in `/lib/pages/brand/components/`
2. Add route in `/app/brand/[id]/`
3. Update navigation in grid components
4. Add breadcrumb navigation
5. Include share functionality

### Adding New Profile Page

1. Create page in `/app/profile/brand/[feature]/page.tsx`
2. Add navigation item to `/app/profile/layout.tsx`
3. Create management component in `/lib/admin/components/`
4. Implement CRUD operations with Firestore
5. Add date formatting if needed

### Implementing Date Fields

1. Add field type as 'date' in EditModal fields config
2. Store dates as YYYY-MM-DD strings
3. Use formatDate() utility for display
4. Example:

```typescript
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
```

## Important Notes

### No Mock Data Fallback

- Components fetch real data from Firestore
- Empty states shown when no data exists
- Mock data only used in AI generation fallback

### User-Brand Relationship

- One user = One brand (except super admin)
- Brand ID stored in user profile
- All brand operations scoped to user's brand

### Security Rules

- Firestore rules should enforce:
  - Users can only edit their own brand
  - Public read access to brands/products
  - Admin-only access to system settings

## Testing Scenarios

1. **New User Flow**:

   - Sign up → Auto-redirect to profile
   - Get Started page shows by default
   - Can access Brand Setup Wizard
   - Upload requirements.txt or fill manually
   - Generate content with progress tracking

2. **Profile Management Flow**:

   - Login → Navigate to /profile
   - Access brand management via sidebar
   - Create/edit/delete products, providers, etc.
   - Use date pickers for scheduling
   - Test delete functionality on providers
   - Test create/delete on reviews (testing mode)

3. **Super Admin Flow**:

   - Login as admin@glamlink.com
   - Auto-redirect from /profile to /admin
   - Only Settings tab visible
   - Can initialize database
   - Cannot access profile pages

4. **Public Browsing**:

   - Visit `/brand` without login
   - See all brands
   - Click to view individual brands
   - Cannot access admin or profile panels

5. **Questionnaire Testing**:
   - Upload sample requirements.txt
   - Verify all fields populate correctly
   - Test "use existing data" toggle
   - Monitor generation progress dialog
   - Verify content appears in brand

## Future Enhancements

- Brand verification/approval system
- Multiple admins per brand
- Brand analytics dashboard
- Social features (following, reviews)
- Payment integration for products
- Advanced search and filtering
- Mobile app development
- Email marketing integration
- Inventory management system
- Appointment booking system
