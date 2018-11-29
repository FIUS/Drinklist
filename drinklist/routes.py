from flask import render_template, url_for, send_from_directory

from . import APP

from .db_models import STD_STRING_SIZE

"""
@APP.route('/')
def index():
    base_path = APP.config.get('APPLICATION_ROOT', '/')
    if base_path is None:
        base_path = '/'
    api_base_path = url_for('api.default_root_resource')
    return render_template('index.html',
                           title='Total Tolles Ferleihsystem',
                           angularBasePath=base_path,
                           apiBasePath=api_base_path,
                           maxDBStringLength=STD_STRING_SIZE)


@APP.route('/assets/<path:file>')
def asset(file):
    return send_from_directory('./build', file)
"""
