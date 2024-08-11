"""updated models, removed relationship between comments and user, comments is related to recipe

Revision ID: e19d0329aa9d
Revises: f70c63d88c8f
Create Date: 2024-08-06 14:16:59.748214

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e19d0329aa9d'
down_revision = 'f70c63d88c8f'
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
