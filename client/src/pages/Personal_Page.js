import React, { useState, useContext, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { MyContext } from '../MyContext';

function PersonalPage() {
    const { user } = useContext(MyContext);
    const [recipes, setRecipes] = useState([]);
    const [editingRecipe, setEditingRecipe] = useState(null);

    useEffect(() => {
        const fetchUserRecipes = async () => {
            try {
                const response = await fetch(`/recipes/${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setRecipes(data);
                } else {
                    console.error('Failed to fetch recipes');
                }
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };
        fetchUserRecipes();
    }, [user.id]);

    const handleDeleteRecipe = async (id) => {
        try {
            const response = await fetch(`/recipes/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setRecipes(recipes.filter(recipe => recipe.id !== id));
            } else {
                console.error('Failed to delete recipe');
            }
        } catch (error) {
            console.error('Error deleting recipe:', error);
        }
    };

    const handleUpdateRecipe = async (values, { resetForm }) => {
        try {
            const response = await fetch(`/recipes/${editingRecipe.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                const updatedRecipe = await response.json();
                setRecipes(recipes.map(recipe => 
                    recipe.id === updatedRecipe.id ? updatedRecipe : recipe
                ));
                setEditingRecipe(null);
                resetForm();
            } else {
                console.error('Failed to update recipe');
            }
        } catch (error) {
            console.error('Error updating recipe:', error);
        }
    };

    const handleCreateRecipe = async (values, { resetForm }) => {
        try {
            const response = await fetch('/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                const newRecipe = await response.json();
                setRecipes([...recipes, newRecipe]);
                resetForm();
            } else {
                console.error('Failed to create recipe');
            }
        } catch (error) {
            console.error('Error creating recipe:', error);
        }
    };

    const validationSchema = Yup.object({
        title: Yup.string().min(3, 'Title must be longer than 3 characters').required('Required'),
        description: Yup.string().min(80, 'Description must be at least 80 characters').required('Required'),
        ingredients: Yup.string().min(30, 'Ingredients must be at least 30 characters').required('Required'),
        instructions: Yup.string().min(80, 'Instructions must be at least 80 characters').required('Required'),
    });

    return (
        <div>
            <h1>{user.username}'s Recipes</h1>
            
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe.id}>
                        <h2>{recipe.title}</h2>
                        <p>{recipe.description}</p>
                        {/* Display other recipe details */}
                        <button onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
                        <button onClick={() => setEditingRecipe(recipe)}>Update</button>
                    </li>
                ))}
            </ul>

            <h2>Create New Recipe</h2>
            <Formik
                initialValues={{
                    title: '',
                    description: '',
                    ingredients: '',
                    instructions: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleCreateRecipe}
            >
                <Form>
                    <div>
                        <label htmlFor="title">Title</label>
                        <Field name="title" type="text" />
                        <ErrorMessage name="title" component="div" />
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <Field name="description" type="text" />
                        <ErrorMessage name="description" component="div" />
                    </div>
                    <div>
                        <label htmlFor="ingredients">Ingredients</label>
                        <Field name="ingredients" type="text" />
                        <ErrorMessage name="ingredients" component="div" />
                    </div>
                    <div>
                        <label htmlFor="instructions">Instructions</label>
                        <Field name="instructions" type="text" />
                        <ErrorMessage name="instructions" component="div" />
                    </div>
                    <button type="submit">Create Recipe</button>
                </Form>
            </Formik>

            {editingRecipe && (
                <Formik
                    initialValues={{
                        title: editingRecipe.title,
                        description: editingRecipe.description,
                        ingredients: editingRecipe.ingredients,
                        instructions: editingRecipe.instructions,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleUpdateRecipe}
                >
                    <Form>
                        <div>
                            <label htmlFor="title">Title</label>
                            <Field name="title" type="text" />
                            <ErrorMessage name="title" component="div" />
                        </div>
                        <div>
                            <label htmlFor="description">Description</label>
                            <Field name="description" type="text" />
                            <ErrorMessage name="description" component="div" />
                        </div>
                        <div>
                            <label htmlFor="ingredients">Ingredients</label>
                            <Field name="ingredients" type="text" />
                            <ErrorMessage name="ingredients" component="div" />
                        </div>
                        <div>
                            <label htmlFor="instructions">Instructions</label>
                            <Field name="instructions" type="text" />
                            <ErrorMessage name="instructions" component="div" />
                        </div>
                        <button type="submit">Update Recipe</button>
                        <button type="button" onClick={() => setEditingRecipe(null)}>Cancel</button>
                    </Form>
                </Formik>
            )}
        </div>
    );
}

export default PersonalPage;