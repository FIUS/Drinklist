"""
Module containing models for whole API to use.
"""

from flask_restplus import fields
from .api import API
from .db_models import STD_STRING_SIZE

__all__ = ['ROOT_MODEL', 'BEVERAGE_POST', 'BEVERAGE_GET', 'USER_POST', 'USER_GET', 'HISTORY_GET']


ROOT_MODEL = API.model('RootModel', {
    'beverages': fields.Url('api.beverages_beverage_list'),
    'users': fields.Url('api.users_user_list'),
    'history': fields.Url('api.history_history_resource'),
})


BEVERAGE_POST = API.model('BeveragePOST', {
    'name': fields.String(max_length=STD_STRING_SIZE, title='Name'),
    'price': fields.Integer(title='Price'),
    'stock': fields.Integer(title='Stock'),
})


BEVERAGE_GET = API.inherit('BeverageGET', BEVERAGE_POST, {
    'id': fields.Integer(min=1, example=1, readonly=True, title='Internal Identifier'),
})


USER_POST = API.model('UserPOST', {
    'name': fields.String(max_length=STD_STRING_SIZE, title='Name'),
    'balance': fields.Integer(title='Balance'),
    'active': fields.Boolean(title='Active'),
})


USER_GET = API.inherit('UserGET', USER_POST, {
    'id': fields.Integer(min=1, example=1, readonly=True, title='Internal Identifier'),
})


HISTORY_GET = API.model('HistoryGET', {
    'name': fields.String(max_length=STD_STRING_SIZE, title='Name'),
    'user': fields.Nested(USER_GET),
    'beverage': fields.Nested(BEVERAGE_GET),
    'beverage_count': fields.Integer(),
    'amount': fields.Integer(),
    'balance': fields.Integer(),
    'reason': fields.String(),
    'cancels.id': fields.Integer(),
    'timestamp': fields.DateTime(),
})
