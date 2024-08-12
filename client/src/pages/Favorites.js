import React, {useState, useEffect, useContext} from 'react'
import { MyContext } from '../MyContext'


function Favorites() {
    const [recipes, setRecipes] = useState
    const {recipeCollections, fetchFavoriteRecipes} = useContext(MyContext)

    console.log(recipeCollections)

    useEffect( async () => {
        const fetchfavorites = await fetch('/recipes/favorites')
        const resp = await fetchfavorites.json()
        setRecipes(resp)
    })


    return (
        <div>
            <h1>Favoritess Page</h1>
            <ul>
                {recipes.map(collection => (
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