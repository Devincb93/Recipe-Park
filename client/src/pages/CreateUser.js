import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'


function CreateUser(){
    const navigate = useNavigate()
    
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const handleCreateUser = (e) => {
        e.preventDefault()
        fetch('/create_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),    
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(`User ${data.username} created`)
            setUsername('')
            setEmail('')
            setPassword('')
            navigate('/recipes')
        })
    }




    return (
       <div>
        <form onSubmit={handleCreateUser}>
            <p>Create a user by entering your information into the field. If a user is created the user accepts all terms and conditions.</p>
            <input placeholder='Username' type='username' value={username} onChange={(e) => setUsername(e.target.value)}></input>
            <input placeholder='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
            <input placeholder='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
            <button type='submit'>Submit</button>
        </form>
       </div>
    )
}
export default CreateUser