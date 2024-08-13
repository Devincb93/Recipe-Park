import { Link } from 'react-router-dom'
import React from 'react'


import { useNavigate, useLocation } from 'react-router-dom'

function NavBar() {

    const location = useLocation()
    const { userLogin, setUserLogin, setUser, user } = location.state || {}
    const navigate = useNavigate()

    const handleLogout = async () => {
  
        try {
          const response = await fetch('/logout', {
            method: 'DELETE',
            
          })
          if (response.ok) {
            const data = await response.json()
            
            setUser(null)
            navigate('/')
          } else {
            const error = await response.json()
            console.error("Logout Failed")
          }
        } catch (error) {
          console.log('Error during logout:', error)
        }
      }

      

    return(
        <div className='NavBar'>
            <Link className='NavBarA' to='/'>Home</Link>
            <Link className='NavBarB' to='/recipes'>All Recipes</Link>
            <Link className='NavBarC' to='/favorites'>Favorites</Link>
            <Link className='NavBarD' to='/about'>About</Link>
            <Link className='NavBarE' to='/personal_page'>Personal Page</Link>
             
                <button onClick={handleLogout}>Logout</button>
          
            
        </div>
        
    )
}

export default NavBar
