import React, { useState } from 'react'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { MyContext } from '../MyContext';


function Login() {

    const { loginUser, user } = useContext(MyContext)

    const navigate = useNavigate()
    
    const formSchema = yup.object().shape({
        username: yup.string().required("Must enter a username"),
    });

    const formik = useFormik({
        initialValues: {
            username: "",
        }, 
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log("form submitted with values:", values);
            fetch(`/login`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: values.username }),
            })
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    loginUser(data);
                    navigate('/personal_page'); // Redirect upon successful login
                }
            })
            .catch((error) => {
                console.error("Error logging in:", error);
            });
        }
    });

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor='username'>Username</label>
                <br/>
                <input
                    id="username"
                    name="username"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                />
                <p style={{ color: "red" }}>{formik.errors.username}</p>
                <button type='submit'>Login</button>
            </form>
        </div>
    );
}

export default Login;