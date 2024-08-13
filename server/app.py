#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, jsonify, session
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Recipe, Comment, RecipeCollection
from werkzeug.security import check_password_hash, generate_password_hash

# Views go here!


app.secret_key = 'session_key'


class Users(Resource):
    def get(self):
        users_dict_list = [user.to_dict() for user in User.query.all()]
        return make_response(
            users_dict_list,
              200
        )
class PostUser(Resource):   
    def post(self):
        data = request.get_json()
        password = data.get('password')
        new_user = User(
            username=data.get('username'),
            email=data.get('email'),
        )
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        new_user_dict = new_user.to_dict()
        return make_response(
            jsonify(new_user_dict),
            201
        )
    
class User_by_id(Resource):
    def get(self,id):
        user = User.query.get(id)
        
        return make_response(
            user.to_dict(),
            200
        )
        
        
    def delete(self, id):
        user = User.query.get(id)
        db.session.delete(user)
        db.session.commit()
        return {'message':'User deleted successfully'}
            
    
class Recipes(Resource):
    def get(self):
        recipes_dict_list = [recipe.to_dict() for recipe in Recipe.query.all()]
        return make_response(
            recipes_dict_list,
            200
        )
    
    def post(self):
        try:
            data = request.get_json()
            new_recipe = Recipe(
                title=data['title'],
                description=data['description'],
                ingredients=data['ingredients'],
                instructions=data['instructions']
            )
            db.session.add(new_recipe)
            db.session.commit()
            new_recipe_dict = new_recipe.to_dict()
            return make_response(
                (new_recipe_dict),
                201
            )
        except Exception as e:
            return make_response({"error": str(e)}, 500)
    
class Recipe_by_id(Resource):
    def get(self, id):
        recipe_by_id = Recipe.query.get(id)
        return make_response(
            recipe_by_id.to_dict(),
            200
        )
    def delete(self, id):
        recipe = Recipe.query.get(id)
        db.session.delete(recipe)
        db.session.commit()
        return {'message':'Recipe deleted successfully'}
    
class Recipe_by_user_id(Resource):
    def get(self, user_id):
        
        if user_id:
            recipes_by_user_id = Recipe.query.filter(Recipe.user_id == user_id).all()
            recipes_user_id_dict_list = [recipe.to_dict() for recipe in recipes_by_user_id]
            return make_response(
                recipes_user_id_dict_list,
                200
            )
    
class Comments(Resource):
    def get(self):
        comments_dict_list = [comments.to_dict() for comments in Comment.query.all()]
        return make_response(
            comments_dict_list,
            200
        )
    
    def post(self):
        data = request.get_json()
        new_comment = Comment(
            content=data['content'],
            recipe_id=data['recipe_id'],
            user_id = data['user_id']

        )
        db.session.add(new_comment)
        db.session.commit()
        return make_response (
            new_comment.to_dict(),
            201
        )
    
class Comment_by_id(Resource):
    def get(self, id):
        comment_by_id = Comment.query.get(id)
        return make_response(
            comment_by_id.to_dict(),
            200
        )
    
    def delete(self, id):
        comment = Comment.query.get(id)
        db.session.delete(comment)
        db.session.commit()
        return {'message':'Comment deleted successfully'}
    
class UserFavorites(Resource):
    def get(self, user_id):
        try:
            favorite_ids = db.session.query(RecipeCollection.recipe_id).filter_by(user_id=user_id).all()
            favorite_ids = [id for (id,) in favorite_ids]  
            return jsonify(favorite_ids)
        except Exception as e:
            
            return {"error": "An error occurred while fetching favorite recipe IDs"}, 500

    
class RecipeDetails(Resource):
    def get(self):
        user_id = request.args.get('user_id')
        try:
            favorite_ids = db.session.query(RecipeCollection.recipe_id).filter_by(user_id=user_id).all()
            favorite_ids = [id for (id,) in favorite_ids]  

            
            recipes = Recipe.query.filter(Recipe.id.in_(favorite_ids)).all()
            recipe_dict_list = [recipe.to_dict() for recipe in recipes]

            return jsonify(recipe_dict_list)
        except Exception as e:
            print(f"Error fetching favorite recipes: {e}")
            return {"error": "An error occurred while fetching favorite recipes"}, 500
        
class CheckSession(Resource):
    def get(self):
        try :
            user = User.query.filter(User.id == session.get('user_id')).first()
            if user:
                return user.to_dict(), 200
            else:
                return {'message': '401: Not Authorized'}, 401
                
        except Exception as error:
            return {"error": str(error)}, 500


class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        user = User.query.filter(User.username==username).first()
        if user and user.check_password(password):
            session['user_id'] = user.id
            return make_response(user.to_dict, 201)
        else: 
            return make_response({"Error":"Invalid credentials"},401)

class Logout(Resource):
    def delete(self): 
        session['user_id'] = None
        return {}, 204
    

class CommentsByRecipe(Resource):
    def get(self, recipe_id):
        comments = Comment.query.filter_by(recipe_id=recipe_id).all()
        comments_dict_list = [comment.to_dict() for comment in comments]
        return make_response(comments_dict_list, 200)

    def post(self):
        data = request.get_json()
        new_comment = Comment(
            content=data.get('content'),
            recipe_id=data.get('recipe_id'),
            user_id=data.get('user_id')
        )
        db.session.add(new_comment)
        db.session.commit()
        return new_comment.to_dict(), 201
    
class Recipe_by_userss(Resource):
    def get(self, user_id):
        recipes = Recipe.query.filter(Recipe.user_id == user_id).all()
        recipe_dict_list = [recipe.to_dict() for recipe in recipes]
        return make_response(recipe_dict_list, 200)
    
    ## grab the recipe thats ingredients greater than 10length

class Recipe_by_ing_len(Resource):
    def get(self, user_id):
        all = []
        recipes = Recipe.query.filter(Recipe.user_id == user_id).all()
        for recipe in recipes:
            if len(recipe.ingredients) >= 10:
                all.append(recipe.to_dict())

        return make_response(all, 200)
        
    

    
api.add_resource(Users, '/users')
api.add_resource(Recipes, '/recipes')
api.add_resource(Comments, '/comments')
api.add_resource(User_by_id, '/users/<int:id>')
api.add_resource(Recipe_by_id, '/recipe/<int:id>')
api.add_resource(Comment_by_id, '/comments/<int:id>')
api.add_resource(PostUser, '/create_user')
api.add_resource(UserFavorites, '/user/<int:user_id>/favorites')
api.add_resource(RecipeDetails, '/recipes/favorites')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(Recipe_by_user_id, '/recipes/<int:user_id>')
api.add_resource(CheckSession, '/check_session')
api.add_resource(CommentsByRecipe, '/comments/recipe/<int:recipe_id>')
api.add_resource(Recipe_by_userss, '/recipe/<int:user_id>')
api.add_resource(Recipe_by_ing_len, '/recipes_ingredient/<int:user_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

