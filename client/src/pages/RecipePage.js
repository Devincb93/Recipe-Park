import React, {useState, useEffect} from 'react'
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import Comments from './Comments';
import { useNavigate, useLocation, useParams } from 'react-router-dom';


function RecipePage() {
    const { id } = useParams()
    const location = useLocation()
    const { userLogin } = location.state || {}
    const [recipes, setRecipes] = useState([])
    const [heart, setHeart] = useState({})
    const [comments, setComments] = useState([])
    


    console.log(userLogin)

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
        };

        fetchRecipes();
    }, []);

    const toggleHeart = (id) => {
        setHeart(prevHeart => ({
            ...prevHeart,
            [id]: !prevHeart[id]
        }));
    };

    const addComment = async (content) => {
        try {
            const response = await fetch('/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    recipe_id:  id,
                    user_id: sessionStorage.getItem('user_id')     
                }),
            });
            const newComment = await response.json();
            if (Array.isArray(comments)) {
                setComments((prevComments) => [...prevComments, newComment]);
            } else {
                console.error('Comments is not an array.');
            }
        } catch (error) {
            console.error('Failed to add comment:', error);
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
                                <div className='heart' onClick={() => toggleHeart(recipe.id)}>
                                    {heart[recipe.id] ? <FaHeart /> : <FaRegHeart />}
                                </div>
                                
                                <Comments comments={comments[recipe.id] || []} onAddComment={addComment} />
                            </div>
                        </ul>
                    </div>
                ))}
            </ul>
        </div>
    );
}

export default RecipePage