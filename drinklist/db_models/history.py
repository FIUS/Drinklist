"""
Module containing database models for everything concerning History entries.
"""
from sqlalchemy.sql import func

from .. import DB
from . import STD_STRING_SIZE
from .beverage import Beverage
from .user import User

__all__ = [ 'History', ]


class History(DB.Model):
    """
    The representation of a History Entry
    """

    __tablename__ = 'History'

    id = DB.Column(DB.Integer, primary_key=True)
    user = DB.Column(DB.Integer, DB.ForeignKey(User.id), nullable=True)
    beverage = DB.Column(DB.Integer, DB.ForeignKey(Beverage.id), nullable=True)
    beverage_count = DB.Column(DB.Integer, nullable=True)
    amount = DB.Column(DB.Integer, nullable=True)
    balance = DB.Column(DB.Integer)
    reason = DB.Column(DB.Text, nullable=True)
    cancels = DB.Column(DB.Integer, DB.ForeignKey(id), nullable=True)
    timestamp = DB.Column(DB.DateTime, server_default=func.now())

    def __init__(self):
        self.user = None
        self.beverage = None
        self.beverage_count = None
        self.amount = None
        self.balance = 0
        self.reason = None
        self.cancels = None

