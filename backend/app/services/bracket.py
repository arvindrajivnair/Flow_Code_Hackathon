import math
from typing import List
from sqlalchemy.orm import Session
from ..models import Team, Match

def generate_bracket(db: Session, tournament_id: str, teams: List[Team]) -> List[Match]:
    """Generate knockout bracket from teams list"""
    team_count = len(teams)
    if team_count < 2:
        raise ValueError("Need at least 2 teams for a bracket")
    
    # Sort teams by seed (None seeds go last)
    sorted_teams = sorted(teams, key=lambda t: (t.seed is None, t.seed))
    
    # Calculate bracket size (next power of 2)
    bracket_size = 1
    while bracket_size < team_count:
        bracket_size *= 2
    
    # Calculate number of rounds
    total_rounds = int(math.log2(bracket_size))
    
    matches = []
    match_counter = 0
    
    # Generate matches for each round
    for round_num in range(1, total_rounds + 1):
        matches_in_round = bracket_size // (2 ** round_num)
        
        for match_idx in range(matches_in_round):
            match = Match(
                tournament_id=tournament_id,
                round=round_num,
                match_idx=match_idx
            )
            
            # For first round, assign teams
            if round_num == 1:
                # Calculate team positions for this match
                team1_pos = match_idx * 2
                team2_pos = match_idx * 2 + 1
                
                if team1_pos < len(sorted_teams):
                    match.team1_id = sorted_teams[team1_pos].id
                if team2_pos < len(sorted_teams):
                    match.team2_id = sorted_teams[team2_pos].id
            
            matches.append(match)
            match_counter += 1
    
    # Save all matches first to get IDs
    db.add_all(matches)
    db.flush()
    
    # Wire up next_match_id and next_match_slot
    for round_num in range(1, total_rounds):
        current_round_matches = [m for m in matches if m.round == round_num]
        next_round_matches = [m for m in matches if m.round == round_num + 1]
        
        for i, match in enumerate(current_round_matches):
            next_match_idx = i // 2
            next_match_slot = (i % 2) + 1  # 1 or 2
            
            if next_match_idx < len(next_round_matches):
                match.next_match_id = next_round_matches[next_match_idx].id
                match.next_match_slot = next_match_slot
    
    db.commit()
    return matches

def advance_winner(db: Session, match: Match) -> None:
    """Advance the winner to the next match"""
    if not match.winner_id or not match.next_match_id:
        return

    next_match = db.query(Match).filter(Match.id == match.next_match_id).first()
    if not next_match:
        return

    # Place winner in appropriate slot
    if match.next_match_slot == 1:
        next_match.team1_id = match.winner_id
        # Clear scores if this match had been played before
        next_match.score1 = None
        next_match.score2 = None
        next_match.winner_id = None
    elif match.next_match_slot == 2:
        next_match.team2_id = match.winner_id
        # Clear scores if this match had been played before
        next_match.score1 = None
        next_match.score2 = None
        next_match.winner_id = None

    db.commit()
    db.refresh(next_match)
