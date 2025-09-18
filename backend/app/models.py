from sqlalchemy import Column, Integer, String, Text, ForeignKey, CheckConstraint, Index, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
import uuid
from .db import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)
    
    __table_args__ = (
        CheckConstraint("role IN ('host', 'viewer')", name='check_user_role'),
    )
    
    tournaments = relationship("Tournament", back_populates="creator")

class Tournament(Base):
    __tablename__ = "tournaments"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    sport = Column(String, nullable=False)
    created_by = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    
    creator = relationship("User", back_populates="tournaments")
    teams = relationship("Team", back_populates="tournament", cascade="all, delete-orphan")
    matches = relationship("Match", back_populates="tournament", cascade="all, delete-orphan")

class Team(Base):
    __tablename__ = "teams"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    seed = Column(Integer, nullable=True)
    tournament_id = Column(PG_UUID(as_uuid=True), ForeignKey("tournaments.id", ondelete="CASCADE"), nullable=False)
    
    tournament = relationship("Tournament", back_populates="teams")
    
    __table_args__ = (
        Index('idx_teams_tournament', 'tournament_id'),
    )

class Match(Base):
    __tablename__ = "matches"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tournament_id = Column(PG_UUID(as_uuid=True), ForeignKey("tournaments.id", ondelete="CASCADE"), nullable=False)
    round = Column(Integer, nullable=False)
    match_idx = Column(Integer, nullable=False)
    team1_id = Column(PG_UUID(as_uuid=True), ForeignKey("teams.id"), nullable=True)
    team2_id = Column(PG_UUID(as_uuid=True), ForeignKey("teams.id"), nullable=True)
    score1 = Column(Integer, nullable=True)
    score2 = Column(Integer, nullable=True)
    winner_id = Column(PG_UUID(as_uuid=True), ForeignKey("teams.id"), nullable=True)
    next_match_id = Column(PG_UUID(as_uuid=True), ForeignKey("matches.id"), nullable=True)
    next_match_slot = Column(Integer, nullable=True)
    
    tournament = relationship("Tournament", back_populates="matches")
    team1 = relationship("Team", foreign_keys=[team1_id])
    team2 = relationship("Team", foreign_keys=[team2_id])
    winner = relationship("Team", foreign_keys=[winner_id])
    
    __table_args__ = (
        CheckConstraint("next_match_slot IN (1, 2)", name='check_next_match_slot'),
        Index('idx_matches_tournament_round', 'tournament_id', 'round'),
    )
