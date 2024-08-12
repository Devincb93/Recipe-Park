import React, { useContext, useEffect, useState } from 'react'
import { MyContext } from '../MyContext';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';



function Home() {
    const { handleLogin, loginError } = useContext(MyContext)
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    useEffect(() => {
        const checkSession = async () => {
            const response = await fetch('/check_session')
            const data = await response.json()
            console.log("checkSession", data)
            if (response.ok){
                setUser(data)
                navigate('/personal_page')
            } else {
                navigate('/login')
            }
        }
        checkSession()
    },[])

    const handleCreateUserClick = () => {
        navigate('/create_user');
    };

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
                navigate('/personal_page');
            }
        },
    });






    return (
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
                    />
                    <input
                        type='password'
                        name='password'
                        placeholder='Password'
                        value={formik.values.password}
                        onChange={formik.handleChange}
                    />
                <button type='submit'>Login</button>
                </form>
                    <button onClick={handleCreateUserClick}>Create User</button>
                
            </div>
        </div>
    )
}

export default Home
