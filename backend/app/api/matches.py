import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Match
from ..schemas import MatchScoreUpdate, MatchResponse
from ..deps import require_host
from ..services.bracket import advance_winner

router = APIRouter()

@router.post("/{match_id}/score", response_model=MatchResponse)
def update_match_score(
    match_id: uuid.UUID,
    score_data: MatchScoreUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_host)
):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    # Update scores
    match.score1 = score_data.score1
    match.score2 = score_data.score2
    
    # Determine winner
    if score_data.score1 > score_data.score2:
        match.winner_id = match.team1_id
    elif score_data.score2 > score_data.score1:
        match.winner_id = match.team2_id
    else:
        match.winner_id = None  # Tie (shouldn't happen in knockout)
    
    db.commit()
    
    # Advance winner to next round
    if match.winner_id:
        advance_winner(db, match)
    
    db.refresh(match)
    return match
