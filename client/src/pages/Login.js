import React, { useState } from 'react'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { MyContext } from '../MyContext';


function Login({  loginError}) {

    const { loginUser } = useContext(MyContext)

    const navigate = useNavigate()
    
    const formSchema = yup.object().shape({
        username: yup.string().required("Must enter a username"),
    })

    const formik = useFormik({
        initialValues: {
            username: "",
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log("form submitted with values:", values)
            fetch(`/login?username=${encodeURIComponent(values.username)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }})

            .then((res) => res.json())
            .then((data) => {
                if (data && data.id){
                loginUser(data)
                console.log("login data", data)
                navigate('/personal_page')
                console.log("success")
            } else {
                console.log("Login fail", data)
            }})
        }
    })
    
    return(
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
                    <p style={{color:"red"}}>{formik.errors.username}</p>
                    <button type='submit'>Login</button>
            </form>
            <table >
                <tbody>
                    <tr>
                        <th></th>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
export default Login