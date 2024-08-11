#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker
from werkzeug.security import generate_password_hash


# Local imports
from app import app
from models import db, User, Recipe, Comment, RecipeCollection

def users():
    users = []
    for i in range(5):
        password =fake.password()
        hashed = generate_password_hash(password)
        user = User(
        username = fake.user_name(),
        email = fake.email(),
        _password = hashed
        )
        users.append(user)
    return users
           

def recipes():
    recipes = []
    for i in range(12):
        recipe = Recipe(
            title = fake.word(),
            description = "A captivating story full of intriguing characters, unexpected twists, and deep emotions.",
            ingredients = "2 cups of flour, 1 cup sugar, 1/2 cup butter, 2 eggs, 1 teaspoon vanilla extract, 1/2 cup milk, 1/4 cup cocoa powder, 1 teaspoon baking powder, 1/2 teaspoon salt, optional nuts and chocolate chips for added texture and flavor.",
            instructions = "Preheat your oven to 350°F (175°C). Grease and flour a baking pan. In a large bowl, mix flour, sugar, and baking powder. Add eggs, milk, and vanilla extract. Stir until smooth. Pour the batter into the prepared pan. Bake for 30-35 minutes, or until a toothpick inserted into the center comes out clean. Let the cake cool before serving.",
            user_id = fake.random_int(min=1, max=5)
        )
        recipes.append(recipe)
    return recipes


def comments():
    comments = [ ]
    for i in range(18):
        comment = Comment(
            content = fake.sentence(90),
            user_id = fake.random_int(min=1, max=5),
            recipe_id = fake.random_int(min=1, max=12)
        )
        comments.append(comment)
    return comments

def create_recipe_collections():
    collections = []
    for _ in range(20):  
        collection = RecipeCollection(user_id = fake.random_int(min=1, max=5),
        recipe_id = fake.random_int(min=1, max=12)
        )
        
        
        collections.append(collection)
        return collections
        
        
        
        
if __name__ == '__main__':
    fake = Faker()

    passwords = ["rdfetghydfs", "ghkdwsuekdd", "ghkfgfrkkld", "fdksderigkd", "fdkalfrggdkjf"]
    with app.app_context():
        print("Starting seed...")
        print("Clearing db...")
        User.query.delete()
        Recipe.query.delete()
        Comment.query.delete()
        RecipeCollection.query.delete()
        db.session.commit()
        

        print("Seeding Users...")
        userss = users()
        db.session.add_all(userss)
        db.session.commit()

        print("Seeding Recipes...")
        recipess = recipes()
        db.session.add_all(recipess)
        db.session.commit()

        print("Seeding comments...")
        commentss = comments()
        db.session.add_all(commentss)
        db.session.commit()

        print("Seeding Recipe_collections...")
        collections = create_recipe_collections()
        db.session.add_all(collections)
        db.session.commit()

        print("Done Seeding!")
