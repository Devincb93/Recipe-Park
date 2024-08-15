import React, { useContext, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Login from './Login';
import Welcome_Page from './WelcomeUser';
import { MyContext } from '../MyContext';




function Home() {
    
    const navigate = useNavigate()
    const { user } = useContext(MyContext)
    // const [userLogin, setUserLogin] = useState(null)
    const [loginError, setLoginError]= useState({})
    
    // useEffect(() => {
    //     fetch('/check_session')
    //     .then((response) => {
    //         if (response.ok) {
    //             response.json()
    //             .then((user)=>{setUser(user)
    //             console.log(user)    
    //             })
                
    //         }
    //     })
        
    // }, []);

    // const handleLogin = async (e) => {
    //     const { username } = e.target.value;
    //     try {
    //         const response = await fetch('/login', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ username }),
    //         });

    //         if (response.ok) {
    //             const data = await response.json();
    //             setUser(data);
    //             console.log('User was set')
    //             navigate('/personal_page');
    //         } else {
    //             const error = await response.json();
    //             setLoginError(error.error);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching user:', error);
    //         setLoginError('An unexpected error occurred. Please try again.');
    //     }
    // };


    const handleCreateUserClick = () => {
        navigate('/create_user');
    };

    

    return (
        <div>
        {user ? (
            <div>
                <Welcome_Page />
                
            </div>
        ) : (
            <div>
                <Login  loginError={loginError}/>
                <button onClick={handleCreateUserClick}>create_user</button>
                
            </div>
        )}
      </div>
        
        
    
    )
}

export default Home
