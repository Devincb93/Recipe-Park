from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Models go here!
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship, validates
from werkzeug.security import generate_password_hash, check_password_hash

from config import db

class RecipeCollection(db.Model):
    __tablename__ = 'recipe_collections'
    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    recipe_id = Column(Integer, ForeignKey('recipes.id'), primary_key=True)
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'recipe_id': self.recipe_id,
            
        }
    
    

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-recipes', '-comments', '-saved_recipes' )

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    email = Column(String)
    _password = Column(String, nullable=False)

    recipes = relationship('Recipe', back_populates='user', cascade='all, delete-orphan')
    comments = relationship('Comment', back_populates='user', cascade='all, delete-orphan')
    saved_recipes = relationship('Recipe', secondary='recipe_collections', back_populates='saved_by_users')

    def set_password(self, password):
        self._password = generate_password_hash(password)
    def check_password(self,password):
        return check_password_hash(self._password, password)

    @validates('username')
    def validate_username(self, key, username):
        if len(username) < 3:
            raise ValueError('Username must be atleast 3 characters or more')
        else:
            return username


    @validates('email')
    def validate_email(self, key, email):
        if not "@" in email:
            raise ValueError('Failed email requirement of "@".')
        else:
            return email
        

    @validates('_password')
    def validate_password(self, key, _password):
        if len(_password) < 8:
            raise ValueError("Password must be a minimum of 8 characters")
        else:
            return _password


class Recipe(db.Model, SerializerMixin):
    __tablename__ = 'recipes'

    serialize_rules = ('-user.recipes', '-comments.user', '-saved_by_users.recipes')

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    ingredients = Column(String, nullable=False)
    instructions = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=db.func.now())
    updated_at = Column(DateTime, onupdate=db.func.now())

    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User', back_populates='recipes')

    comments = relationship('Comment', back_populates='recipes')
    saved_by_users = relationship('User', secondary='recipe_collections', back_populates='saved_recipes')

    @validates('title')
    def validate_title(self, key, title):
        if len(title) < 3:
            raise ValueError('Title must be longer than 3 characters')
        else:
            return title
        
    @validates('description')
    def validate_description(self, key, description):
        if len(description) < 80:
            raise ValueError('Description must be at least 80 characters')
        else:
            return description
        
    @validates('ingredients')
    def validate_ingredients(self, key, ingredients):
        if len(ingredients) < 30:
            raise ValueError('Ingredients must be atleast 30 characters')
        else:
            return ingredients
        
    @validates('instructions')
    def validate_instructions(self, key, instructions):
        if len(instructions) < 80:
            raise ValueError('Instructions must be at least 80 characters')
        else:
            return instructions

class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'

    serialize_rules = ('-recipes.comments', '-user.comments',)

    id = Column(Integer, primary_key=True)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=db.func.now())
    updated_at = Column(DateTime, onupdate=db.func.now())

    recipe_id = Column(Integer, ForeignKey('recipes.id'))
    recipes = relationship('Recipe', back_populates='comments')

    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User', back_populates='comments')

    @validates('content')
    def validate_content(self, key, content):
        if len(content) < 1:
            raise ValueError('Must have an input for comments')
        else:
            return content
        

