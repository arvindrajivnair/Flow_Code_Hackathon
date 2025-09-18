# SeedIt - Tournament Bracket Generator

A modern tournament bracket management system with real-time updates, supporting multiple sports formats with host-controlled administration.

## Features

- *Multi-Sport Support*: Basketball, football, badminton, and more
- *Smart Bracket Generation*: Auto-generates knockout brackets with optional team seeding
- *Host-Only Control*: Secure JWT authentication restricting write access to tournament hosts
- *Real-time Updates*: Live bracket updates via WebSocket or polling fallback
- *Modern UI*: Black & gold themed interface with interactive elements and smooth animations
- *Responsive Design*: Works seamlessly across desktop and mobile devices

## Tech Stack

- *Frontend*: React 18 + Vite + Tailwind CSS
- *Backend*: FastAPI + Pydantic v2 + SQLAlchemy 2.x + Alembic
- *Database*: PostgreSQL with optimized indexing
- *Authentication*: JWT tokens with role-based access control
- *Real-time*: WebSocket (FastAPI) + Postgres LISTEN/NOTIFY
- *Deployment*: Docker Compose ready

## Quick Start

### Option 1: Docker Compose (Recommended)

bash
git clone <repository-url>
cd seedit
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker-compose up --build


The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Option 2: Local Development

#### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+

#### Backend Setup
bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Database setup
createdb seedit_db
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000


#### Frontend Setup
bash
cd frontend
npm install
cp .env.example .env
npm run dev


## Project Structure


/seedit
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry
│   │   ├── api/                 # API route handlers
│   │   │   ├── auth.py
│   │   │   ├── tournaments.py
│   │   │   └── matches.py
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── deps.py              # Dependencies (auth, db)
│   │   ├── services/
│   │   │   ├── bracket.py       # Bracket generation logic
│   │   │   └── auth.py          # JWT & password handling
│   │   └── db.py                # Database connection
│   ├── alembic/                 # Database migrations
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Bracket.jsx      # Tournament bracket display
│   │   │   ├── TeamForm.jsx     # Team management
│   │   │   └── MatchCard.jsx    # Individual match display
│   │   ├── pages/
│   │   │   ├── CreateTournament.jsx
│   │   │   └── BracketView.jsx
│   │   ├── api/                 # API client functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md


## API Endpoints

### Authentication
- POST /auth/login - Host login (returns JWT token)
- GET /auth/me - Get current user info

### Tournaments
- POST /tournaments - Create tournament (host-only)
- GET /tournaments/{id} - Get tournament details and bracket
- POST /tournaments/{id}/teams - Add teams to tournament (host-only)
- POST /tournaments/{id}/bracket/generate - Generate initial bracket (host-only)

### Matches
- POST /matches/{id}/score - Update match score and advance winner (host-only)
- WebSocket /tournaments/{id}/stream - Real-time bracket updates

## Database Schema

### Core Tables
- *users*: Authentication and role management
- *tournaments*: Tournament metadata and sport type
- *teams*: Team information with optional seeding
- *matches*: Match details with bracket progression logic

### Key Features
- Foreign key relationships ensure data integrity
- Indexes on (tournament_id, round) for fast bracket queries
- next_match_id and next_match_slot fields handle bracket progression
- Unique constraints prevent duplicate team names per tournament

## Authentication & Authorization

### User Roles
- *Host*: Can create tournaments, add teams, update scores
- *Viewer*: Read-only access to view brackets and scores

### JWT Implementation
- Tokens expire in 24 hours
- Role-based middleware restricts write operations
- Secure password hashing with bcrypt

## Development Workflow

### Adding New Features
1. Create database migration if schema changes needed
2. Update models and schemas in backend
3. Implement API endpoints with proper authentication
4. Add frontend components and API integration
5. Test with both host and viewer accounts

### Running Tests
bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test


## Environment Variables

### Backend (.env)

DATABASE_URL=postgresql://user:password@localhost/seedit_db
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=["http://localhost:3000"]


### Frontend (.env)

VITE_API_BASE_URL=http://localhost:8000


## Deployment

The application is containerized and ready for deployment on platforms like:
- Railway
- Render
- DigitalOcean App Platform
- AWS ECS/Fargate

Update CORS_ORIGINS in production to match your domain.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with appropriate tests
4. Submit a pull request