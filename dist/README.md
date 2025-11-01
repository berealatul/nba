# React App Deployment

## Current Status
This folder contains a **placeholder** `index.html` file. Replace it with your actual React build output.

## How to Deploy Your React App

### 1. Build Your React App
```bash
npm run build
# or
yarn build
```

### 2. Copy Build Files Here
Copy **all contents** from your React build folder (usually `build/` or `dist/`) to this directory:

```bash
# Example
cp -r my-react-app/build/* /xampp/htdocs/nba/dist/
```

### 3. Configure React Router
Update your React app's router configuration:

```jsx
<BrowserRouter basename="/nba">
  {/* Your routes */}
</BrowserRouter>
```

### 4. Configure API Base URL
Set your API calls to use:
```
http://localhost/nba/api
```

## Expected Structure After Build

```
dist/
├── index.html
├── assets/
│   ├── index.[hash].js
│   ├── index.[hash].css
│   └── ...
└── [other build files]
```

## Testing

After deployment:
- Visit: `http://localhost/nba/`
- Your React app should load
- API calls should work at `http://localhost/nba/api/`

## Troubleshooting

- **Routes not working?** Make sure basename is set to `/nba`
- **API calls failing?** Check API base URL configuration
- **404 errors?** Ensure all build files are copied

---

**Need help?** See `/docs/ROUTING_CONFIGURATION.md` for complete guide.
