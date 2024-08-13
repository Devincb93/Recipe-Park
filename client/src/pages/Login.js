import React from 'react'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

function Login({ handleLogin, loginError}) {

    const navigate = useNavigate()

    const validationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is requierd'),
    })

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            await handleLogin(values);
            setSubmitting(false);
            if (!loginError) {
                
            }
        },
    });

    return(
        <div className='Home-container'>
        <h1>Recipe Park </h1>
        <p>A place to share your recipes with a new friend!</p>
            <div className='Login-container'>
                <h3>Enter your username and password to Login</h3>
                <form onSubmit={formik.handleSubmit}>
                    <input
                        type='text'
                        name='username'
                        placeholder='Username'
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        autoComplete='username'
                    />
                    <input
                        type='password'
                        name='password'
                        placeholder='Password'
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        autoComplete='current-password'
                    />
                <button type='submit'>Login</button>
                </form>
            </div>
        </div>
    )
}
export default Login