# Excel Analytics Platform

A comprehensive data analytics platform with AI-powered insights, advanced charting capabilities, and user management features.

## Features

### 🤖 AI Summary Hub
- **Intelligent Data Analysis**: Generate AI-powered summaries of datasets, charts, and reports
- **OpenAI Integration**: Uses GPT-3.5-turbo for intelligent insights
- **Export Options**: Download summaries in PDF and Excel formats
- **Persistent Storage**: Save and manage all generated summaries

### 📊 Advanced Charting
- **2D Charts**: Bar, Line, Pie, Scatter, Area, Doughnut, Radar, Bubble, Horizontal Bar, Stacked Bar
- **3D Visualization**: 3D Bar, 3D Scatter, 3D Line charts with enhanced rendering
- **Custom 3D Engine**: HTML5 Canvas-based 3D charts with proper axes and depth
- **Interactive Controls**: Dynamic chart type switching and axis selection

### 📁 Data Management
- **File Upload**: Support for Excel/CSV files
- **Dataset Management**: Rename, download, and delete datasets
- **Data Preview**: Interactive table view with sample data

### 👥 User Management
- **Role-Based Access**: User and Admin roles with approval workflow
- **Account Switching**: Seamless user switching without logout
- **Admin Panel**: User management and platform oversight

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- OpenAI API key

### 1. Clone and Install Dependencies
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

### 2. Environment Configuration

#### Server (.env)
Create `server/.env` file:
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/excel_analytics?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# OpenAI API Key (Required for AI Summary feature)
OPENAI_API_KEY=your_openai_api_key_here

# Server Port
PORT=5000
```

#### OpenAI API Key Setup
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in `server/.env`

### 3. MongoDB Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Add your IP address to the whitelist
4. Create a database user with read/write permissions
5. Get your connection string and update `MONGODB_URI` in `.env`

### 4. Start the Application

#### Start Server
```bash
cd server
npm start
```

#### Start Client
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## AI Summary Feature

### How It Works
1. **Data Analysis**: Upload datasets or create charts
2. **AI Generation**: Click "Generate Summary" to get AI insights
3. **Smart Prompts**: System automatically creates context-aware prompts
4. **Persistent Storage**: All summaries are saved and can be accessed later
5. **Export Options**: Download summaries in PDF or Excel format

### Supported Summary Types
- **Dataset**: Analysis of data structure, patterns, and recommendations
- **Chart**: Insights about visualization and data trends
- **Report**: Comprehensive analysis of saved chart reports
- **Platform**: Overview of your analytics platform usage

### API Endpoints
- `POST /api/ai/generate-summary` - Generate new AI summary
- `GET /api/ai/summaries` - Get user's saved summaries
- `DELETE /api/ai/summaries/:id` - Delete a summary

## Chart Types

### 2D Charts
- **Bar Chart**: Vertical bar visualization
- **Line Chart**: Trend line visualization
- **Pie Chart**: Proportional data representation
- **Scatter Plot**: Correlation analysis
- **Area Chart**: Filled area visualization
- **Doughnut Chart**: Ring-shaped data representation
- **Radar Chart**: Multi-dimensional data comparison
- **Bubble Chart**: Three-dimensional data points
- **Horizontal Bar**: Horizontal bar visualization
- **Stacked Bar**: Grouped data representation

### 3D Charts
- **3D Bar Chart**: Three-dimensional bar visualization with depth
- **3D Scatter Plot**: Three-dimensional data points with Z-axis
- **3D Line Chart**: Three-dimensional line with depth variation

## User Roles

### Regular User
- Upload and manage datasets
- Create and save charts
- Generate AI summaries
- Access personal dashboard

### Admin User
- All user capabilities
- User management
- Platform oversight
- Admin approval workflow

## File Structure

```
excel-analytics-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── index.js           # Server entry point
└── README.md
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your IP is whitelisted in MongoDB Atlas
   - Check connection string format
   - Ensure database user has correct permissions

2. **OpenAI API Errors**
   - Verify API key is correct
   - Check API key has sufficient credits
   - Ensure API key is properly set in `.env`

3. **Port Conflicts**
   - Change PORT in `.env` if 5000 is occupied
   - Update client API base URL if needed

### Support
For issues or questions:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check MongoDB and OpenAI service status

## License
This project is licensed under the MIT License.