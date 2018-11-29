from setuptools import setup

setup(
    name='drinklist',
    packages=['drinklist'],
    include_package_data=True,
    install_requires=[
        'flask',
        'flask_sqlalchemy',
        'flask_jwt_extended',
        'flask_migrate',
    ],
)
