import React, {useState, useEffect, useContext} from 'react'
import { MyContext } from '../MyContext'


function Favorites() {
    const {recipeCollections, fetchFavoriteRecipes} = useContext(MyContext)

    console.log(recipeCollections)

    useEffect(() => {
        const userId = 1; // Replace with actual user ID from context or auth
        fetchFavoriteRecipes(userId).then(recipes => {
            console.log(recipes);
            // Update state or UI with recipes data
        });
    }, []);


    return (
        <div>
            <h1>Favoritess Page</h1>
            <ul>
                {recipeCollections.map(collection => (
                    <div key={collection.id}>
                        <h2>{collection.user_id}</h2>
                        <h2>{collection.recipe_id}</h2>
                    </div>
                ))}
            </ul>
        </div>
    )
}

export default Favorites