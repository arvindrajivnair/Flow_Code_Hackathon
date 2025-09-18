from typing import List
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Tournament, Team, Match
from ..schemas import TournamentCreate, TournamentResponse, TeamCreate, TeamResponse, TournamentWithBracket
from ..deps import get_current_user, require_host
from ..services.bracket import generate_bracket

router = APIRouter()

@router.post("", response_model=TournamentResponse)
def create_tournament(
    tournament_data: TournamentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_host)
):
    tournament = Tournament(
        name=tournament_data.name,
        sport=tournament_data.sport,
        created_by=current_user.id
    )
    
    db.add(tournament)
    db.commit()
    db.refresh(tournament)
    
    return tournament

@router.get("/{tournament_id}", response_model=TournamentWithBracket)
def get_tournament(tournament_id: uuid.UUID, db: Session = Depends(get_db)):
    tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    teams = db.query(Team).filter(Team.tournament_id == tournament_id).all()
    matches = db.query(Match).filter(Match.tournament_id == tournament_id).order_by(Match.round, Match.match_idx).all()
    
    return {
        "tournament": tournament,
        "teams": teams,
        "matches": matches
    }

@router.post("/{tournament_id}/teams", response_model=TeamResponse)
def add_team(
    tournament_id: uuid.UUID,
    team_data: TeamCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_host)
):
    # Verify tournament exists
    tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    # Check if team name is unique in tournament
    existing_team = db.query(Team).filter(
        Team.tournament_id == tournament_id,
        Team.name == team_data.name
    ).first()
    
    if existing_team:
        raise HTTPException(status_code=400, detail="Team name already exists in this tournament")
    
    team = Team(
        name=team_data.name,
        seed=team_data.seed,
        tournament_id=tournament_id
    )
    
    db.add(team)
    db.commit()
    db.refresh(team)
    
    return team

@router.post("/{tournament_id}/bracket/generate")
def generate_tournament_bracket(
    tournament_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user = Depends(require_host)
):
    # Verify tournament exists
    tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    # Get teams
    teams = db.query(Team).filter(Team.tournament_id == tournament_id).all()
    if len(teams) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 teams to generate bracket")
    
    # Clear existing matches
    db.query(Match).filter(Match.tournament_id == tournament_id).delete()
    
    # Generate bracket
    matches = generate_bracket(db, tournament_id, teams)
    
    return {"message": f"Generated bracket with {len(matches)} matches"}
