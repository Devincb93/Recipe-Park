"""added relationship from recipe to recipecolection to be able to get recipe information.

Revision ID: e81e4928433d
Revises: e35f9c0bace7
Create Date: 2024-08-10 19:01:47.816894

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e81e4928433d'
down_revision = 'e35f9c0bace7'
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
