import React, {useState, useEffect, useContext} from 'react'
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import Comments from './Comments';
import { MyContext } from '../MyContext';


function RecipePage() {
    
    
    const { user } = useContext(MyContext)
    const [recipes, setRecipes] = useState([])
    const [heart, setHeart] = useState({})
    const [comments, setComments] = useState([])
    const [userForFav, setUserForFave] = useState({})
    


    

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('/recipes');
                if (response.ok) {
                    const data = await response.json();
                    setRecipes(data);
                    
                   
                    for (const recipe of data) {
                        await fetchComments(recipe.id);
                    }
                } else {
                    console.error('Failed to fetch recipes');
                }
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        const fetchComments = async (recipeId) => {
            try {
                const response = await fetch(`/comments/recipe/${recipeId}`);
                if (response.ok) {
                    const data = await response.json();
                    setComments(prevComments => ({
                        ...prevComments,
                        [recipeId]: data
                    }));
                } else {
                    console.error('Failed to fetch comments');
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        }

        fetchRecipes();

        const fetchUserforFavorites = () => {
            fetch(`/users/${user.username}`)
            .then((resp) => resp.json())
            .then ((data) => {
                setUserForFave(data)
            })
        }
        fetchUserforFavorites()
    }, [])

    const toggleHeart = (recipe_id) => {
        fetch('/newfavorite', {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                user_id: userForFav.user_id,
                recipe_id: recipe_id
            })
        })
        .then((resp) => resp.json)
        .then((data) => {
            console.log("success")
        })
    }

    

   

   
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
                                <div className='heart' onClick={() => toggleHeart(recipe.id)}>
                                    {heart[recipe.id] ? <FaHeart /> : <FaRegHeart />}
                                </div>
                                
                                {/* <Comments comments={comments[recipe.id] || []} onAddComment={addComment} /> */}
                            </div>
                        </ul>
                    </div>
                ))}
            </ul>
        </div>
    );
}

export default RecipePage