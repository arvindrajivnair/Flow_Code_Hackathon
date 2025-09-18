from pydantic import BaseModel, EmailStr
from typing import Optional, List
import uuid

# Auth schemas
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str = "viewer"

class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    role: str
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Tournament schemas
class TournamentCreate(BaseModel):
    name: str
    sport: str

class TournamentResponse(BaseModel):
    id: uuid.UUID
    name: str
    sport: str
    created_by: Optional[uuid.UUID]
    
    class Config:
        from_attributes = True

# Team schemas
class TeamCreate(BaseModel):
    name: str
    seed: Optional[int] = None

class TeamResponse(BaseModel):
    id: uuid.UUID
    name: str
    seed: Optional[int]
    tournament_id: uuid.UUID
    
    class Config:
        from_attributes = True

# Match schemas
class MatchScoreUpdate(BaseModel):
    score1: int
    score2: int

class MatchResponse(BaseModel):
    id: uuid.UUID
    round: int
    match_idx: int
    team1_id: Optional[uuid.UUID]
    team2_id: Optional[uuid.UUID]
    score1: Optional[int]
    score2: Optional[int]
    winner_id: Optional[uuid.UUID]
    next_match_id: Optional[uuid.UUID]
    next_match_slot: Optional[int]
    
    class Config:
        from_attributes = True

class TournamentWithBracket(BaseModel):
    tournament: TournamentResponse
    teams: List[TeamResponse]
    matches: List[MatchResponse]
