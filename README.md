# Excel Analytics Platform

A simple web app to upload, analyze, and visualize Excel data. You can create charts, get AI-generated summaries, and manage users with admin controls.

## What You Can Do
- Upload Excel or CSV files
- Preview and manage your datasets
- Create 2D and 3D charts
- Get AI-powered summaries of your data and charts
- Save and download reports
- Manage users (admin only)

## Quick Start

### 1. Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (free tier is fine)
- OpenAI API key (for AI summaries)

### 2. Clone and Install
```bash
git clone <repository-url>
cd excel-analytics-platform

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Set Up Environment Variables

#### Server (`server/.env`):
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
PORT=5000
```

- Get your MongoDB URI from MongoDB Atlas
- Get your OpenAI API key from https://platform.openai.com/

### 4. Start the App

#### Start the backend:
```bash
cd server
npm start
```

#### Start the frontend:
```bash
cd ../client
npm start
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Main Features
- **Upload Excel/CSV**: Drag and drop or select files
- **Charting**: Make bar, line, pie, scatter, and 3D charts
- **AI Summaries**: Click "Generate Summary" for instant insights
- **Reports**: Save and download your charts and summaries
- **User Roles**: Regular users and admins (admins can manage users)

## File Structure (Short Version)
```
excel-analytics-platform/
├── client/    # React frontend
├── server/    # Node.js backend
```

## Troubleshooting
- **MongoDB errors**: Check your URI and IP whitelist in Atlas
- **OpenAI errors**: Make sure your API key is correct and has credits
- **Port in use**: Change `PORT` in `.env` if needed

## License
MIT