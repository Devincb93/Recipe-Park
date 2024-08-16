import React, { useState, useEffect } from 'react';

function RecipeCard({ recipe, userId }) {
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        
        fetch(`/api/check_favorite?user_id=${userId}&recipe_id=${recipe.id}`)
            .then(response => response.json())
            .then(data => setIsFavorited(data.isFavorited))
            .catch(error => console.error('Error fetching favorite status:', error));
    }, [userId, recipe.id]);

    const handleFavoriteClick = () => {
        fetch('/api/favorite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, recipe_id: recipe.id })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Added to favorites") {
                    setIsFavorited(true);
                } else {
                    setIsFavorited(false);
                }
            })
            .catch(error => console.error('Error updating favorite:', error));
    };

    return (
        <div className="recipe-card">
            <h2>{recipe.title}</h2>
            <button onClick={handleFavoriteClick}>
                {isFavorited ? 'Unfavorite' : 'Favorite'}
            </button>
        </div>
    );
}

export default RecipeCard;