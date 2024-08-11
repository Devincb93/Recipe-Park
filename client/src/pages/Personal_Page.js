import React, { useContext, useEffect } from 'react'
import { MyContext } from '../MyContext'
import { useNavigate } from 'react-router-dom'

function PersonalPage() {
    
    const {handleLogout, userLogin, fetch_recipes, recipes} = useContext(MyContext)
    const navigate = useNavigate()

    
    useEffect(() =>
    {
        if (!userLogin){
            navigate('/')
        } else {
            fetch_recipes()
        }
    },[navigate, fetch_recipes])

    

    
    
    if (!userLogin){
        return <h1>Loading...</h1>
        
    }
    return (
        <div>
        <h1>Home Page</h1>
        <h2>My recipes</h2>
        {recipes.map(recipe => (
            <div key={recipe.id}>
            <h4>{recipe.title}</h4>
            </div>
        ))}
        
        </div>
    )
}

export default PersonalPage