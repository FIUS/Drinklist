from os import environ

from flask import Flask, logging
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.schema import MetaData
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

APP = Flask(__name__, instance_relative_config=True)  # type: Flask

mode = APP.config['ENV'].upper()
if mode == 'PRODUCTION':
    APP.config.from_object('drinklist.config.ProductionConfig')
elif mode == 'DEBUG':
    APP.config.from_object('drinklist.config.DebugConfig')
elif mode == 'TEST':
    APP.config.from_object('drinklist.config.TestingConfig')

APP.config.from_pyfile('/etc/drinklist.conf', silent=True)
APP.config.from_pyfile('drinklist.conf', silent=True)
if ('CONFIG_FILE' in environ):
    APP.config.from_pyfile(environ.get('CONFIG_FILE', 'drinklist.conf'), silent=True)

CONFIG_KEYS = ('SQLALCHEMY_DATABASE_URI', 'JWT_SECRET_KEY')
for env_var in CONFIG_KEYS:
    APP.config[env_var] = environ.get(env_var, APP.config.get(env_var))


APP.logger.debug('Debug logging enabled')
APP.logger.info('Connecting to database %s.', APP.config['SQLALCHEMY_DATABASE_URI'])

# Setup DB with Migrations and bcrypt
DB: SQLAlchemy
DB = SQLAlchemy(APP, metadata=MetaData(naming_convention={
    'pk': 'pk_%(table_name)s',
    'fk': 'fk_%(table_name)s_%(column_0_name)s',
    'ix': 'ix_%(table_name)s_%(column_0_name)s',
    'uq': 'uq_%(table_name)s_%(column_0_name)s',
    'ck': 'ck_%(table_name)s_%(column_0_name)s',
}))

MIGRATE: Migrate = Migrate(APP, DB)

# Setup JWT
JWT: JWTManager = JWTManager(APP)

# pylint: disable=C0413
from . import db_models
# pylint: disable=C0413
from . import routes

if APP.config.get('DEBUG', False):
    from . import debug_routes
