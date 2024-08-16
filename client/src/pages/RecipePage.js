import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from '../MyContext';
import CommentForm from './CommentForm';

function RecipePage() {
    const { user } = useContext(MyContext);
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState({});
    const [comments, setComments] = useState({});

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('/recipes');
                if (response.ok) {
                    const data = await response.json();
                    setRecipes(data);

                    const userFavoritesResponse = await fetch(`/favorites/${user.username}`);
                    if (userFavoritesResponse.ok) {
                        const userFavorites = await userFavoritesResponse.json();
                        const favoritesState = {};
                        userFavorites.forEach(fav => {
                            favoritesState[fav.recipe_id] = true;
                        });
                        setFavorites(favoritesState);
                    }

                    const commentsFetches = data.map(recipe =>
                        fetch(`/comments/recipe/${recipe.id}`).then(res => res.json())
                    );
                    const commentsData = await Promise.all(commentsFetches);
                    const commentsState = {};
                    data.forEach((recipe, index) => {
                        commentsState[recipe.id] = commentsData[index];
                    });
                    setComments(commentsState);
                }
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, [user.username]);

    const toggleFavorite = async (recipe_id) => {
        console.log("Recipe ID:", recipe_id);
        const isFavorited = favorites[recipe_id];
        
        if (isFavorited) {
            try {
                const response = await fetch(`/removefavorite/${user.id}/${recipe_id}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    setFavorites(prevFavorites => {
                        const updatedFavorites = { ...prevFavorites };
                        delete updatedFavorites[recipe_id];
                        return updatedFavorites;
                    });
                }
            } catch (error) {
                console.error('Error removing favorite:', error);
            }
        } else {
            try {
                const response = await fetch('/newfavorite', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ user_id: user.id, recipe_id: recipe_id })
                });
                if (response.ok) {
                    setFavorites(prevFavorites => ({
                        ...prevFavorites,
                        [recipe_id]: true
                    }));
                }
            } catch (error) {
                console.error('Error adding to favorites:', error);
            }
        }
    };

    const handleCommentAdded = async (recipeId) => {
        try {
            const response = await fetch(`/comments/recipe/${recipeId}`);
            if (response.ok) {
                const updatedComments = await response.json();
                setComments(prevComments => ({
                    ...prevComments,
                    [recipeId]: updatedComments
                }));
            }
        } catch (error) {
            console.error('Error fetching updated comments:', error);
        }
    };

    return (
        <div>
            <h1>Recipe Page</h1>
            <ul>
                {recipes.map(recipe => (
                    <div className='recipe-container-single' key={recipe.id}>
                        <h2>{recipe.title}</h2>
                        <p>{recipe.description}</p>
                        {favorites[recipe.id] ? (
                            <span>Favorited</span>
                        ) : (
                            <button onClick={() => toggleFavorite(recipe.id)}>Favorite</button>
                        )}

                        <div>
                            <h3>Comments:</h3>
                            <ul>
                                {(comments[recipe.id] || []).map(comment => (
                                    <li key={comment.id}>
                                        <strong>{comment.username}:</strong> {comment.content}
                                    </li>
                                ))}
                            </ul>
                            <CommentForm recipeId={recipe.id} onCommentAdded={handleCommentAdded} />
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
}

export default RecipePage;