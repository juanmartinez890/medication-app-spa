# Medication Management App

A modern React + TypeScript single-page application for managing medication schedules and tracking upcoming doses. Built with Vite, Tailwind CSS, and React Router.

## Features

- **View Upcoming Doses**: See all scheduled medication doses grouped by date (Today, Tomorrow, This Week, Later)
- **Create Medications**: Add new medications with daily or weekly schedules
- **Mark as Taken**: Track when doses are taken
- **Modern UI**: Clean, responsive design with smooth animations
- **Notifications**: Success and error notifications for user actions
- **Local Storage**: Automatically manages care recipient ID

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- Access to the medication API backend

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Or create `.env` manually with:

```env
VITE_API_URL=https://your-api-url.com
```

**Note**: Replace `https://your-api-url.com` with your actual API base URL (e.g., `https://k9ypg6i6yc.execute-api.us-east-1.amazonaws.com`)

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

### 4. Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Testing the Application

### Initial Setup

1. **Start the app**: Run `npm run dev`
2. **Open browser**: Navigate to `http://localhost:5173`
3. **Check console**: Ensure no errors appear in the browser console

### Test Scenarios

#### 1. View Upcoming Doses

- **Expected**: The main page loads showing upcoming medication doses
- **What to check**:
  - Doses are grouped by date (Today, Tomorrow, This Week, Later)
  - Each dose card displays:
    - Medication name
    - Dosage information
    - Scheduled time with color-coded badge
    - Recurrence type (DAILY/WEEKLY)
    - Notes (if available)
  - Time badges show different colors:
    - Green: More than 2 hours away
    - Amber: Less than 2 hours away
    - Red: Overdue or missed

#### 2. Create a New Medication (Daily)

1. Click the **"+ New Medication"** button (floating button, bottom right)
2. Fill in the form:
   - **Name**: e.g., "Ibuprofen"
   - **Dosage**: e.g., "200mg"
   - **Notes**: (optional) e.g., "Take with food"
   - **Recurrence**: Select "Daily"
   - **Times of day**: 
     - Use the time picker to select a time (e.g., 08:00)
     - Click "Add" to add the time
     - Add multiple times if needed
   - **Active**: Toggle on/off
3. Click **"Create"**
4. **Expected**: 
   - Success notification appears
   - Drawer closes automatically
   - New medication appears in upcoming doses list

#### 3. Create a New Medication (Weekly)

1. Click **"+ New Medication"** button
2. Fill in the form:
   - **Name**: e.g., "Vitamin D"
   - **Dosage**: e.g., "1000 IU"
   - **Recurrence**: Select "Weekly"
   - **Days of week**: 
     - Select a day from dropdown (Sunday = 0, Monday = 1, etc.)
     - Click "Add" to add the day
     - Add multiple days if needed
3. Click **"Create"**
4. **Expected**: Same as daily medication

#### 4. Mark Dose as Taken

1. Find an upcoming dose with status "UPCOMING"
2. Click the **"Mark as Taken"** button
3. **Expected**:
   - Button shows loading state ("Marking...")
   - After success, button changes to "Taken" with checkmark
   - Dose status updates in the list

#### 5. Error Handling

- **Test API Error**: 
  - Temporarily set wrong `VITE_API_URL` in `.env`
  - Try to load doses or create medication
  - **Expected**: Error message displayed in red notification/toast

- **Test Validation**:
  - Try to create medication without name or dosage
  - **Expected**: Error message appears in form

#### 6. Empty State

- If no doses are scheduled:
  - **Expected**: Empty state message "There are no upcoming doses scheduled" with icon

#### 7. Responsive Design

- **Test on different screen sizes**:
  - Desktop: Full layout with side-by-side elements
  - Mobile: Stacked layout, floating button remains accessible
  - **Expected**: Layout adapts smoothly, all functionality works

### Keyboard Shortcuts

- **Escape**: Closes the medication drawer when open

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DoseCard.tsx    # Individual dose card component
│   ├── MedicationDrawer.tsx
│   ├── NewMedicationForm.tsx
│   └── Notification.tsx
├── pages/              # Page components
│   └── UpcomingDosesPage.tsx
├── services/           # API service layer
│   ├── dosesService.ts
│   └── medicationsService.ts
├── utils/              # Utility functions
│   ├── apiClient.ts   # API client with error handling
│   ├── careRecipient.ts
│   └── dateUtils.ts   # Date formatting utilities
├── types/              # TypeScript type definitions
│   ├── dose.ts
│   └── index.ts
├── constants/          # Application constants
│   ├── dose.ts
│   ├── doseStatus.ts
│   └── formDefaults.ts
├── theme.ts            # Theme colors and gradients
└── theme.css           # CSS variables
```

## Code Quality Features

- **Modular Architecture**: Separated concerns (services, components, utils, types)
- **Type Safety**: Full TypeScript coverage with strict types
- **Error Handling**: Custom ApiError class with consistent error handling
- **Constants Management**: Magic numbers and strings extracted to constants
- **Reusable Utilities**: Date formatting, API client, etc.
- **Clean Code**: No code duplication, well-organized structure

## API Endpoints Used

- `GET /care-recipients/{careRecipientId}/doses/upcoming` - Fetch upcoming doses
- `POST /care-recipients/{careRecipientId}/doses/taken` - Mark dose as taken
- `POST /medications` - Create new medication

## Troubleshooting

### App won't start

- **Check Node version**: `node --version` (should be v18+)
- **Clear cache**: `rm -rf node_modules package-lock.json && npm install`
- **Check port**: Ensure port 5173 is not in use

### API errors

- **Verify `.env` file exists** and contains `VITE_API_URL`
- **Check API URL** is correct and accessible
- **Check browser console** for detailed error messages
- **Verify CORS** is configured on the API server

### No doses showing

- **Check API connection**: Verify `VITE_API_URL` is correct
- **Check browser console** for API errors
- **Verify care recipient ID** is being generated (stored in localStorage)

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **React Router DOM** - Client-side routing
- **Font Awesome** - Icons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

**Note for Reviewers**: The app automatically generates and stores a care recipient ID in browser localStorage on first use. This ID is used for all API requests. To test with a fresh state, clear browser localStorage.
