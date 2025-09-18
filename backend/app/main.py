from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import settings
from .api import auth, tournaments, matches

app = FastAPI(title="SeedIt Tournament Bracket API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(tournaments.router, prefix="/tournaments", tags=["tournaments"])
app.include_router(matches.router, prefix="/matches", tags=["matches"])

@app.get("/")
def root():
    return {"message": "SeedIt Tournament Bracket API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
