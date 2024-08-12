import React, {useState, useEffect, useContext} from 'react'
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { MyContext } from '../MyContext';


function RecipePage() {
    const [recipes, setRecipes] = useState([])
    const [heart, setHeart] = useState({})
    


    console.log(recipes)

    useEffect(() => {
        const fetchRecipes = async () => {
            const response = await fetch ('/recipes')
            const data = await response.json()
            setRecipes(data)
        } 
        fetchRecipes()
       },[])

    const toggleHeart = (id) => {
        setHeart(prevHeart => ({
            ...prevHeart,
            [id]: !prevHeart[id]
        }));
    };

   

   
    return(
        <div>
        <h1>Recipe Page</h1>
        <ul>
            {recipes.map(recipe => (
                
                <div className='recipe-container-single' key={recipe.id}>
                    <ul >
                        <div>
                            <h2>{recipe.title}</h2>
                            <p>{recipe.description}</p>
                            <div className='heart' onClick={() => toggleHeart(recipe.id)}>
                            {heart[recipe.id] ? <FaHeart /> : <FaRegHeart />}
                            </div>
                        </div>
                    
                </ul>
                </div>
            ))}
        </ul>
        </div>
    )
}

export default RecipePage