# SeedIt - Tournament Bracket Generator

A full-stack tournament bracket generator application that allows users to create tournaments, manage teams, generate knockout brackets, and track match results in real-time.

## 🏆 Features

- **Tournament Management**: Create tournaments for different sports and competitions
- **Team Seeding**: Add teams with proper seeding for fair bracket generation
- **Automated Brackets**: Generate knockout tournament brackets automatically
- **Real-time Updates**: Update match scores and track tournament progress
- **User Roles**: Host and Viewer roles with different permissions
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **RESTful API**: FastAPI backend with PostgreSQL database
- **Authentication**: Secure JWT-based user authentication

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern JavaScript framework
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL ORM for database operations
- **PostgreSQL** - Relational database
- **Alembic** - Database migration tool
- **JWT Authentication** - Secure token-based auth
- **Pydantic** - Data validation and serialization

### DevOps
- **Docker & Docker Compose** - Containerization and orchestration
- **PostgreSQL** - Production-ready database

## 🚀 Quick Start

### Prerequisites

#### For Mac
```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Docker Desktop
brew install --cask docker

# Install Node.js (for local development)
brew install node

# Install Python (for local development)
brew install python@3.11

# Verify installations
docker --version
node --version
python3 --version
```

#### For Windows
1. **Install Docker Desktop**
   - Download from [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
   - Run the installer and follow the setup wizard
   - Restart your computer when prompted

2. **Install Node.js**
   - Download from [Node.js official website](https://nodejs.org/)
   - Choose the LTS version (18.x or higher)
   - Run the installer with default settings

3. **Install Python**
   - Download from [Python official website](https://www.python.org/downloads/)
   - Choose Python 3.11 or higher
   - **Important**: Check "Add Python to PATH" during installation

4. **Install Git (if not already installed)**
   - Download from [Git for Windows](https://git-scm.com/download/win)
   - Use default settings during installation

5. **Verify installations** (in Command Prompt or PowerShell)
   ```cmd
   docker --version
   node --version
   python --version
   git --version
   ```

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd seedit
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Local Development

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Backend Setup
```bash
cd backend
pip install -e .
uvicorn app.main:app --reload --port 8000
```

#### Database Setup
```bash
# Start PostgreSQL with Docker
docker run -d \
  --name seedit-postgres \
  -e POSTGRES_DB=seedit_db \
  -e POSTGRES_USER=seedit \
  -e POSTGRES_PASSWORD=seedit123 \
  -p 5432:5432 \
  postgres:15

# Run database migrations
cd backend
alembic upgrade head
```

## 📖 Usage Guide

### 1. User Registration/Login
- Create an account as a **Host** (can create and manage tournaments) or **Viewer** (can only view tournaments)
- Login with your credentials to access the dashboard

### 2. Create Tournament
- Navigate to "Create Tournament"
- Enter tournament name and select sport/competition type
- Add participating teams with optional seeding

### 3. Generate Bracket
- Once teams are added, generate the knockout bracket
- The system automatically creates matchups based on seeding

### 4. Manage Matches
- Update match scores as games are completed
- Track tournament progress in real-time
- View bracket visualization with current standings

### 5. View Results
- Monitor tournament progression
- View match history and results
- Export tournament data (if implemented)

## 📁 Project Structure

```
seedit/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── api/             # API client functions
│   │   ├── components/      # Reusable React components
│   │   │   ├── Bracket.jsx  # Tournament bracket visualization
│   │   │   ├── Layout.jsx   # App layout wrapper
│   │   │   ├── MatchCard.jsx# Individual match display
│   │   │   └── TeamForm.jsx # Team management form
│   │   ├── pages/           # Main application pages
│   │   │   ├── BracketView.jsx    # Tournament bracket page
│   │   │   ├── CreateTournament.jsx # Tournament creation
│   │   │   └── Login.jsx           # Authentication page
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Application entry point
│   ├── package.json         # Frontend dependencies
│   └── tailwind.config.js   # Tailwind CSS configuration
├── backend/                  # FastAPI backend application
│   ├── app/
│   │   ├── api/             # API route handlers
│   │   │   ├── auth.py      # Authentication endpoints
│   │   │   ├── tournaments.py # Tournament management
│   │   │   └── matches.py   # Match management
│   │   ├── services/        # Business logic layer
│   │   │   ├── auth.py      # Authentication service
│   │   │   └── bracket.py   # Bracket generation logic
│   │   ├── db.py           # Database configuration
│   │   ├── models.py       # SQLAlchemy models
│   │   ├── schemas.py      # Pydantic schemas
│   │   └── main.py         # FastAPI application
│   ├── alembic/            # Database migrations
│   ├── pyproject.toml      # Python dependencies
│   └── Dockerfile          # Backend container config
├── docker-compose.yml       # Multi-service orchestration
└── README.md               # This file
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `uvicorn app.main:app --reload` - Start development server
- `alembic upgrade head` - Apply database migrations
- `pytest` - Run tests

### Docker
- `docker-compose up` - Start all services
- `docker-compose down` - Stop all services
- `docker-compose build` - Rebuild containers

## 🎯 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Tournaments
- `GET /tournaments` - List tournaments
- `POST /tournaments` - Create tournament
- `GET /tournaments/{id}` - Get tournament details
- `PUT /tournaments/{id}` - Update tournament
- `DELETE /tournaments/{id}` - Delete tournament

### Matches
- `GET /matches` - List matches
- `PUT /matches/{id}` - Update match score
- `GET /matches/tournament/{id}` - Get tournament matches

## 🎨 Design System

The application uses a clean, modern design with the following color scheme:
- **Primary**: Black (#000000)
- **Accent**: Gold (#FFD700)
- **Background**: Various shades of gray
- **Text**: High contrast black/white combinations

## 🔒 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://seedit:seedit123@localhost:5432/seedit_db
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGINS=["http://localhost:5173"]
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## 🚧 Development Notes

- The frontend uses Vite for fast development and building
- Backend follows FastAPI best practices with dependency injection
- Database migrations are managed with Alembic
- CORS is configured for local development
- JWT tokens are used for stateless authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏃‍♂️ Next Steps

- [ ] Add tournament templates for different sports
- [ ] Implement real-time updates with WebSockets
- [ ] Add tournament statistics and analytics
- [ ] Implement bracket export functionality
- [ ] Add email notifications for match updates
- [ ] Mobile app development
- [ ] Tournament scheduling system

---

Built with ⚡ by developers, for tournament organizers worldwide.