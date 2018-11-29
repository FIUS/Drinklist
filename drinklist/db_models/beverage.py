"""
Module containing database models for everything concerning Beverages.
"""

from .. import DB
from . import STD_STRING_SIZE

__all__ = [ 'Beverage', ]


class Beverage(DB.Model):
    """
    The representation of a Beverage
    """

    __tablename__ = 'Beverage'

    id = DB.Column(DB.Integer, primary_key=True)
    name = DB.Column(DB.String(STD_STRING_SIZE), unique=True)
    prize = DB.Column(DB.Integer)
    stock = DB.Column(DB.Integer)

    def __init__(self, name: str, prize: int, stock: int = 0):
        self.name = name
        self.prize = prize
        self.stock = stock

