# NBA React + API Routing Configuration

## Overview

The NBA project is now configured to serve both a React application and a PHP API from the same domain.

## URL Structure

### React Application
- **Base URL:** `http://localhost/nba/`
- **Location:** Served from `/dist/` folder
- **All Routes:** Any non-API route serves the React app's `index.html` for client-side routing

Examples:
- `http://localhost/nba/` → React app (index.html)
- `http://localhost/nba/dashboard` → React app (index.html)
- `http://localhost/nba/profile` → React app (index.html)
- `http://localhost/nba/login` → React app (index.html)

### API Endpoints
- **Base URL:** `http://localhost/nba/api/`
- **Handler:** All API requests are routed to `api/index.php`

Examples:
- `http://localhost/nba/api/login` → API handler
- `http://localhost/nba/api/profile` → API handler
- `http://localhost/nba/api/department` → API handler
- `http://localhost/nba/api/logout` → API handler

## Directory Structure

```
nba/
├── .htaccess           # Routing configuration
├── dist/               # React build output
│   ├── index.html      # Main React app entry
│   ├── assets/         # JS, CSS, images (when built)
│   └── ...
├── api/                # PHP API backend
│   ├── index.php       # API entry point
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── routes/
│   └── utils/
└── docs/               # Documentation
```

## How It Works

### `.htaccess` Configuration

1. **API Routes Priority:**
   - All requests to `/nba/api/*` are immediately routed to `api/index.php`
   - API requests bypass React routing entirely

2. **Static Files:**
   - Files with extensions (`.js`, `.css`, `.png`, etc.) are served directly from `dist/`
   - No rewriting for actual files

3. **React SPA Routes:**
   - All other requests serve `dist/index.html`
   - Enables client-side routing in React

4. **Security:**
   - Blocks access to sensitive PHP files (`setup_database.php`, etc.)
   - Blocks `.git` files
   - Disables directory listing

### Key `.htaccess` Rules

```apache
# Set directory index
DirectoryIndex dist/index.html

# API routes go to api/index.php
RewriteRule ^api/(.*)$ api/index.php [QSA,L]

# Static files served from dist
RewriteCond %{REQUEST_URI} \.(js|css|png|jpg|...)$ [NC]
RewriteCond %{DOCUMENT_ROOT}/nba/dist/%{REQUEST_URI} -f
RewriteRule ^(.*)$ dist/$1 [L]

# All other routes serve index.html (React SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/nba/api/
RewriteRule ^.*$ dist/index.html [L]
```

## Deploying Your React App

### Step 1: Build Your React App

In your React project directory:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Step 2: Copy Build Output

Copy the contents of your React build folder to `C:\xampp\htdocs\nba\dist\`:

```bash
# Example (adjust paths as needed)
cp -r my-react-app/build/* C:/xampp/htdocs/nba/dist/
```

Or manually:
1. Delete existing `dist/` contents (except keep folder structure)
2. Copy all files from your React `build/` folder to `dist/`

### Step 3: Configure React Router (if using)

Update your React app's `BrowserRouter` basename:

```jsx
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter basename="/nba">
      {/* Your routes */}
    </BrowserRouter>
  );
}
```

### Step 4: Configure API Base URL

In your React app, set the API base URL:

```javascript
// config.js or .env
export const API_BASE_URL = 'http://localhost/nba/api';

// or in .env
VITE_API_BASE_URL=http://localhost/nba/api
REACT_APP_API_BASE_URL=http://localhost/nba/api
```

### Step 5: Update Build Configuration (if needed)

For Vite projects, update `vite.config.js`:

```javascript
export default defineConfig({
  base: '/nba/',
  // ... other config
});
```

For Create React App, update `package.json`:

```json
{
  "homepage": "/nba",
  // ... other config
}
```

## Testing Your Setup

### Test React App
```bash
# Open in browser
http://localhost/nba/

# Should load your React application
```

### Test API
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost/nba/api/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"employeeIdOrEmail":"1001","password":"admin123"}'
```

### Test React Routing
```bash
# Any React route should work
http://localhost/nba/dashboard
http://localhost/nba/profile
http://localhost/nba/any-route

# All should load index.html and let React handle routing
```

## Common Issues & Solutions

### Issue: 404 on React Routes
**Solution:** Make sure `.htaccess` is properly configured and mod_rewrite is enabled in Apache.

### Issue: API Calls Fail
**Solution:** 
- Check that API base URL in React matches `/nba/api`
- Verify MySQL is running
- Check Apache error logs: `C:\xampp\apache\logs\error.log`

### Issue: Static Assets Not Loading
**Solution:**
- Ensure files are in `dist/` folder
- Check file paths in your React build
- Verify `basename` is set correctly in React Router

### Issue: CORS Errors
**Solution:** CORS is already handled in the API's `CorsMiddleware.php`. If issues persist:
- Clear browser cache
- Check API headers in Network tab
- Verify `CorsMiddleware` is active

## Development Workflow

### 1. React Development
```bash
# In your React project
npm run dev

# Access at http://localhost:5173 (or your dev server port)
# API calls will still go to http://localhost/nba/api
```

### 2. Production Build
```bash
# Build React app
npm run build

# Copy to dist folder
cp -r build/* /xampp/htdocs/nba/dist/

# Access at http://localhost/nba/
```

### 3. API Development
- Make changes in `api/` folder
- Changes are immediately available at `http://localhost/nba/api/`
- No build step needed for PHP

## Security Notes

1. **Production Deployment:**
   - Change JWT secret in `api/utils/JWTService.php`
   - Update CORS settings in `api/middleware/CorsMiddleware.php`
   - Set proper file permissions
   - Enable HTTPS

2. **Protected Files:**
   - `.htaccess` blocks access to `setup_database.php`
   - `.git` files are blocked
   - Directory listing is disabled

3. **Database:**
   - Use strong passwords in production
   - Never commit database credentials to version control
   - Consider using environment variables

## Quick Reference

| What | URL | Handler |
|------|-----|---------|
| React App | `/nba/` | `dist/index.html` |
| React Routes | `/nba/*` (non-API) | `dist/index.html` |
| API | `/nba/api/*` | `api/index.php` |
| Static Files | `/nba/*.{js,css,png...}` | `dist/*` |

---

**Last Updated:** November 2, 2025  
**Status:** ✅ Fully Configured & Tested
