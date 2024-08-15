import React, { useContext } from 'react'
import { MyContext } from '../MyContext'

function Welcome_Page(){

    const { user } = useContext(MyContext)
    return (
        <h1>Welcome {user.username}</h1>
    )
}

export default Welcome_Page