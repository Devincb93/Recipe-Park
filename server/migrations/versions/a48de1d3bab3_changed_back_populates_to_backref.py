"""changed back_populates to backref

Revision ID: a48de1d3bab3
Revises: 3fefb905a5c6
Create Date: 2024-08-05 18:14:22.780197

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a48de1d3bab3'
down_revision = '3fefb905a5c6'
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
