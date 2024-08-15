"""reinitiliazed migrations. migrations stopped upgrading and downgrading

Revision ID: 04341afd29e7
Revises: baa744958506
Create Date: 2024-08-13 22:06:15.491144

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '04341afd29e7'
down_revision = 'baa744958506'
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
