"""
Module containing database models for everything concerning Users.
"""

from .. import DB
from . import STD_STRING_SIZE

__all__ = [ 'User', ]


class User(DB.Model):
    """
    The representation of a User
    """

    __tablename__ = 'User'

    id = DB.Column(DB.Integer, primary_key=True)
    name = DB.Column(DB.String(STD_STRING_SIZE), unique=True)
    active = DB.Column(DB.Boolean)
    balance = DB.Column(DB.Integer)

    def __init__(self, name: str, active: bool = True, balance: int = 0):
        self.name = name
        self.active = active
        self.balance = balance

