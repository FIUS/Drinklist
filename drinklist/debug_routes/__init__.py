"""
Module containing Debug Methods and sites.

This Module should only be loaded in debug Mode.
"""

from flask import Blueprint, render_template
from .. import APP

if not APP.config['DEBUG']:
    raise ImportWarning("This Module should only be loaded if DEBUG mode is active!")

debug_blueprint = Blueprint('debug_routes', __name__, template_folder='templates',
                            static_folder='static')


@debug_blueprint.route('/')
@debug_blueprint.route('/index')
def index():
    output = []
    for rule in APP.url_map.iter_rules():

        line = {
            'endpoint': rule.endpoint,
            'methods': ', '.join(rule.methods),
            'url': rule.rule
        }
        output.append(line)
    output.sort(key=lambda x: x['url'])
    return render_template('debug/all.html',
                           title='Drinklist – Routes',
                           routes=output)


APP.register_blueprint(debug_blueprint, url_prefix='/debug')
