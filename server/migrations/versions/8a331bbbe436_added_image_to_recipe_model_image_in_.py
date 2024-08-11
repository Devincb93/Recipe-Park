"""added image to recipe model. image in seeds do not have images. image will not be nullable

Revision ID: 8a331bbbe436
Revises: 9afe45520790
Create Date: 2024-08-08 17:12:11.889299

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8a331bbbe436'
down_revision = '9afe45520790'
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
