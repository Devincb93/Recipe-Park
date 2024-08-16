import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from '../MyContext';

function FavoritesPage() {
    const { user } = useContext(MyContext);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(`/favorites/${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched favorites data:', data); // Check the data structure
                    setFavorites(data); // Ensure this is an array
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };

        fetchFavorites();
    }, [user.id]);

    const removeFavorite = async (recipe_id) => {
        console.log("Removing Favorite, Recipe ID:", recipe_id); // Check the value of recipe_id
        
        try {
            const response = await fetch(`/removefavorite/${user.id}/${recipe_id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                // Remove item from state
                setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== recipe_id));
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
                            <h3>{favorite.id}</h3>
                            <h2>{favorite.title}</h2>
                            <p>{favorite.description}</p>
                            <button onClick={() => removeFavorite(favorite.id)}>Remove</button>
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