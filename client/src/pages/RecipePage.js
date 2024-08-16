import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from '../MyContext';

function RecipePage() {
    const { user } = useContext(MyContext);
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState({});

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
                }
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, [user.username]);

    const toggleFavorite = async (recipe_id) => {
        console.log("Recipe ID:", recipe_id); // Log recipe_id
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

    return (
        <div>
            <h1>Recipe Page</h1>
            <ul>
                {recipes.map(recipe => (
                    <div className='recipe-container-single' key={recipe.id}>
                        <ul>
                            <div>
                                <h2>{recipe.title}</h2>
                                <p>{recipe.description}</p>
                                {favorites[recipe.id] ? (
                                    <span>Favorited</span>
                                ) : (
                                    <button onClick={() => toggleFavorite(recipe.id)}>Favorite</button>
                                )}
                            </div>
                        </ul>
                    </div>
                ))}
            </ul>
        </div>
    );
}

export default RecipePage;