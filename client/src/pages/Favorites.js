import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from '../MyContext';

function FavoritesPage() {
    const { user } = useContext(MyContext);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                console.log(user.id)
                const response = await fetch(`/favorites/${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFavorites(data);
                    console.log(favorites)
                    console.log(data)
                    
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };
    
        fetchFavorites();
    }, []);

    const removeFavorite = async (recipe_id) => {
        console.log("Removing Favorite, Recipe ID:", recipe_id); // Verify recipe_id
        try {
            const response = await fetch(`/removefavorite/${user.id}/${recipe_id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setFavorites(prevFavorites => prevFavorites.filter(fav => fav.recipe_id !== recipe_id));
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    return (
        <div>
            <h1>Favorites Page</h1>
            <ul>
                {favorites.length > 0 ? (
                    favorites.map(favorite => (
                        <div className='favorite-container-single' key={favorite.id}>
                            <h2>{favorite.title}</h2>
                            <p>{favorite.description}</p>
                            <button onClick={() => removeFavorite(favorite.recipe_id)}>Remove</button>
                        </div>
                    ))
                ) : (
                    <p>No favorites found.</p>
                )}
            </ul>
        </div>
    );
}

export default FavoritesPage;