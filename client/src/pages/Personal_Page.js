import React, { useContext, useEffect } from 'react'
import { MyContext } from '../MyContext'
import { useNavigate, useLocation } from 'react-router-dom'
import Comments from './Comments'

function PersonalPage() {
    const location = useLocation()
    
    const { userLogin, setUserRecipes, userRecipes} = location.state || {}
    const navigate = useNavigate()

    useEffect(() => {
        if (!userLogin) {
            navigate('/');
        } else {
            const fetchRecipesByUser = async () => {
                try {
                    const response = await fetch(`/recipes/${userLogin.user_id}`);
                    if (response.ok) {
                        const recipes = await response.json();
                        setUserRecipes(recipes);
                    } else {
                        console.log('Error fetching recipes');
                    }
                } catch (error) {
                    console.log('Error fetching recipes');
                } 
            };

            fetchRecipesByUser();
        }
    }, [navigate, userLogin, setUserRecipes]);

 
 
    
    

    
    
    if (!userLogin){
        return <h1>Loading...</h1>
        
    }
    return (
        <div>
        <h1>Home Page</h1>
        <h2>My recipes</h2>
        {userRecipes.map(recipe => (
            <div key={recipe.id}>
            <h4>{recipe.title}</h4>
            
            </div>
        ))}
        
        </div>
    )
}

export default PersonalPage