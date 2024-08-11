import { Link } from 'react-router-dom'
import React from 'react'
import { useContext } from 'react'
import { MyContext } from '../MyContext'

function NavBar() {

    const {handleLogout, userLogin} = useContext(MyContext)
    return(
        <div className='NavBar'>
            <Link className='NavBarA' to='/'>Home</Link>
            <Link className='NavBarB' to='/recipes'>All Recipes</Link>
            <Link className='NavBarC' to='/favorites'>Favorites</Link>
            <Link className='NavBarD' to='/about'>About</Link>
             {userLogin ? (
                <button onClick={handleLogout}>Logout</button>
             ) : (
                <></>
             )}
            
        </div>
        
    )
}

export default NavBar
