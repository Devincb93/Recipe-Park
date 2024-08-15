import { Link } from 'react-router-dom'
import React, { useContext } from 'react'
import { MyContext } from '../MyContext'

import { useNavigate, useLocation } from 'react-router-dom'

function NavBar() {

    
    const { user, setUser } = useContext(MyContext)
    const navigate = useNavigate()

    // const handleLogout = async () => {
  
    //     try {
    //       const response = await fetch('/logout', {
    //         method: 'DELETE',
            
    //       })
    //       if (response.ok) {
    //         const data = await response.json()
            
    //         setUser({})
    //         navigate('/')
    //       } else {
    //         const error = await response.json()
    //         console.error("Logout Failed")
    //       }
    //     } catch (error) {
    //       console.log('Error during logout:', error)
    //     }
    //   }

    const handleLogout = () => {
      setUser("")
    }

      

    return(
        <div className='NavBar'>
            <Link className='NavBarA' to='/'>Home</Link>
            <Link className='NavBarB' to='/recipes'>All Recipes</Link>
            <Link className='NavBarC' to='/favorites'>Favorites</Link>
            <Link className='NavBarD' to='/about'>About</Link>
            
             {user ? (
                <button onClick={handleLogout}>Logout</button>
             ) : (
              <></>
             )
            }
        </div>
        
    )
}

export default NavBar
