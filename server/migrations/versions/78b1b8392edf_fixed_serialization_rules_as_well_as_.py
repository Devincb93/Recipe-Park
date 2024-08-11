"""Fixed serialization rules, as well as made an association table for users and recipes, all added flaskrestful resources to each model create, read, and delete have been implemented

Revision ID: 78b1b8392edf
Revises: 658ec08b1292
Create Date: 2024-08-06 21:29:47.184088

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '78b1b8392edf'
down_revision = '658ec08b1292'
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
