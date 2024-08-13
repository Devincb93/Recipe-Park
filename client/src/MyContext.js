import React, { useState, useEffect, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { date } from "yup";

const MyContext = React.createContext();



const MyProvider = (props) => {
const [recipes, setRecipes] = useState([])
const [recipeCollections, setRecipeCollections] = useState([])
const [userRecipes, setUserRecipes] = useState([])
const navigate = useNavigate()

const recipes_fetch = useCallback(async () => {
    try {
        const response = await fetch("/recipes")
        if (response.ok) {
            const recipesData = await response.json()
            setRecipes(recipesData)
        } else {
            throw new Error("Failed to fetch recipes")
        }
    } catch (error) {
        console.error("Error fetching recipes", error)
    }
   },[]);

const fetchFavoriteRecipeIds = async (user_id) => {
  try {
    const response = await fetch (`/user/${user_id}/favorites`)
    if (response.ok) {
      const favoriteIds = await response.json()
      return favoriteIds
    } else {
      throw new Error('Failed to fetch recipe ids')
    }
  } catch (error) {
    console.log(error)
  }
}

const fetchFavoriteRecipes = async (user_id) => {
  try {
      const favoriteIds = await fetchFavoriteRecipeIds(user_id);
      const query = new URLSearchParams({ user_id }).toString();
      const response = await fetch(`/recipes/favorites?${query}`);
      if (!response.ok) {
          throw new Error('Failed to fetch favorite recipes');
      }
      const recipes = await response.json();
      setRecipeCollections(recipes);
  } catch (error) {
      console.error('Error fetching favorite recipes:', error);
  }
}




  return (
    <MyContext.Provider
      value={{
        recipes,
        recipes_fetch,
        recipeCollections,
        fetchFavoriteRecipeIds,
        fetchFavoriteRecipes,
        userRecipes,
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};

const MyConsumer = MyContext.Consumer;

export { MyProvider, MyConsumer, MyContext };