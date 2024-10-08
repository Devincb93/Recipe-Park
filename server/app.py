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
        
        new_user = User(
            username=data.get('username'),
            email=data.get('email'),
        )
        
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
            
class User_by_username(Resource):
    def get(self, username):
        user = User.query.filter_by(username=username).first()
        return user.to_dict(),200


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
        username = request.get_json().get('username')  

        user = User.query.filter(User.username == username).first()
        if user:
            return user.to_dict(), 200
        else: 
            return make_response({"Error": "Invalid credentials"}, 401)

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
    
class Recipe_collection_post(Resource):
    def post(self):
        data = request.get_json()
        new_collection = RecipeCollection(
            user_id=data.get('user_id'),
            recipe_id=data.get('recipe_id')
        )
        db.session.add(new_collection)
        db.session.commit()
    
class RemoveFavorite(Resource):
    def delete(self, user_id, recipe_id):
        
        favorite = RecipeCollection.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()
        print(favorite)
        if favorite:
            db.session.delete(favorite)
            db.session.commit()
            
            return {'status': 'success'}, 200
        else:
            
            return {'status': 'not found'}, 404
    
class GetUserFavorites(Resource):
    def get(self, username):
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({'status': 'user not found'}), 404
        
        favorites = RecipeCollection.query.filter_by(user_id=user.id).all()
        favorite_recipes = [{'recipe_id': fav.recipe_id, 
                            'title': Recipe.query.get(fav.recipe_id).title, 
                            'description': Recipe.query.get(fav.recipe_id).description}
                            for fav in favorites]
    
        return jsonify(favorite_recipes), 200

class AddFavorite(Resource):
    def post(self):
        data = request.json
        user_id = data['user_id']
        recipe_id = data['recipe_id']
        
        existing_favorite = RecipeCollection.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()
        if existing_favorite:
            return jsonify({'status': 'already exists'}), 409
        
        new_favorite = RecipeCollection(user_id=user_id, recipe_id=recipe_id)
        db.session.add(new_favorite)
        db.session.commit()
        return jsonify({'status': 'success'}), 201
    
class UserFavoritesPage(Resource):
    def get(self, user_id):
        if not user_id:
            return jsonify({"error": "Missing user_id parameter"}), 400

        user_favorites = RecipeCollection.query.filter_by(user_id=user_id).all()

        if user_favorites:
            recipe_ids = [favorite.recipe_id for favorite in user_favorites]
            recipes = Recipe.query.filter(Recipe.id.in_(recipe_ids)).all()
            recipes_list = [recipe.to_dict() for recipe in recipes]
            return recipes_list, 200
        else:
            return jsonify({"message": "No favorite recipes found"}), 404
        
class CheckFavorite(Resource):
    def get():
        user_id = request.args.get('user_id')
        recipe_id = request.args.get('recipe_id')
        
        if not user_id or not recipe_id:
            return jsonify({"error": "Missing parameters"}), 400

        is_favorited = RecipeCollection.query.filter_by(user_id=user_id, recipe_id=recipe_id).first() is not None
        return jsonify({"isFavorited": is_favorited}), 200
    
class AddComment(Resource):
    def get(self, recipe_id):
        data = request.get_json()
        recipe_id = data.get('recipe_id')
        user_id = data.get('user_id')
        content = data.get('content')

        if not recipe_id or not user_id or not content:
            return jsonify({'message': 'Missing data'}), 400

        new_comment = Comment(recipe_id=recipe_id, user_id=user_id, content=content)
        db.session.add(new_comment)
        db.session.commit()

        return jsonify({'message': 'Comment added successfully'}), 201
    
class AddRecipe(Resource):
    def post():
        data = request.get_json()
        new_recipe = Recipe(
            title=data['title'],
            description=data['description'],
            ingredients=data['ingredients'],
            instructions=data['instructions'],
            user_id=data['user_id']  
        )
        db.session.add(new_recipe)
        db.session.commit()
        return new_recipe.to_dict(), 201
    
class DeleteRecipe(Resource):
    def delete(self, id):
        recipe = Recipe.query.get(id)
        if recipe:
            db.session.delete(recipe)
            db.session.commit()
            return jsonify({"message": "Recipe deleted successfully"})
        else:
            return jsonify({"error": "Recipe not found"}), 404
        
class UpdateRecipe(Resource):
    def put(self, id):
        data = request.json
        recipe = Recipe.query.get(id)
        if recipe:
            recipe.title = data.get('title', recipe.title)
            recipe.description = data.get('description', recipe.description)
            recipe.ingredients = data.get('ingredients', recipe.ingredients)
            recipe.instructions = data.get('instructions', recipe.instructions)
            db.session.commit()
            return recipe.to_dict(), 200
        else:
            return jsonify({"error": "Recipe not found"}), 404
    
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
api.add_resource(User_by_username, '/users/<string:username>')
api.add_resource(Recipe_collection_post, '/newfavorite')
api.add_resource(RemoveFavorite, '/removefavorite/<int:user_id>/<int:recipe_id>')
api.add_resource(GetUserFavorites, '/userfavorites/<username>')
api.add_resource(AddFavorite, '/newfavorite')
api.add_resource(UserFavoritesPage, '/favorites/<int:user_id>')
api.add_resource(CheckFavorite, '/check_favorite')
api.add_resource(AddComment, '/comments')
api.add_resource(DeleteRecipe, '/recipes/<int:id>')
api.add_resource(UpdateRecipe, '/recipes/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

