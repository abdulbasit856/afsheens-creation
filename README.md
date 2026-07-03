# Afsheen's Creations - Recipe Website

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm run install:all

# 2. Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Add your credentials to .env files

# 4. Run development servers
npm run dev
```

## 📦 Features
- Full MERN Stack (MongoDB, Express, React, Node.js)
- ImageKit for image hosting and CDN
- YouTube video embeds
- Comments system with admin approval
- Admin dashboard for CRUD operations
- Search and filter functionality
- Responsive design
- SEO optimized

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_IMAGEKIT_PUBLIC_KEY=your_public_key
REACT_APP_IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

## 📁 Project Structure
```
afsheen-creations/
├── backend/         # Express API
├── frontend/        # React App
├── package.json     # Root package
└── README.md
```

## 🚀 Deployment

### Backend (Railway/Render)
1. Push to GitHub
2. Connect to Railway/Render
3. Add environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push to GitHub
2. Import to Vercel/Netlify
3. Add environment variables
4. Deploy

## 📝 License
MIT