import {useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { contextUI } from '../store/contextUI';
import { useSocket } from '../store/SocketContextProvider';

function Navbar() {
  const {loggedIn , handleLogout} = useContext(contextUI)
  const navigate = useNavigate()
  const socket= useSocket()
  const token = localStorage.getItem("userToken")
  const logoutHandler = async () => {
      const response = await fetch("http://localhost:8000/auth/logout",{
         method : "POST",
         headers : {
             "authorization": `Bearer ${token}`,
             "Content-type" : "application/json"
         }
      })
      if(!response.ok){
          const errorData = await response.json()
          console.log(errorData.message)
          return;
      }
      localStorage.removeItem("userToken")
      handleLogout()
      socket.disconnect();
      navigate("/")
  }
  return <nav className="bg-gray-900 font-bold text-white flex items-center justify-between pt-6 px-10">
            <h1 className='text-lg'>AM_FASTER</h1>
            <ul className='flex items-center justify-center text-lg gap-5 text-white px-6'>
            <li><NavLink className={({isActive})=> isActive ? "text-gold" : "text-white"} to="/">Home</NavLink></li>
            <li><NavLink className={({isActive})=> isActive ? "text-gold" : "text-white"} to="/challenges">Games</NavLink></li>
            <li><NavLink className={({isActive})=> isActive ? "text-gold" : "text-white"}  to="/multiplayer">Multiplayer</NavLink></li>
            {(loggedIn || token ) ?<li className='cursor-pointer' onClick={logoutHandler}>Logout</li> : <li><NavLink className={({isActive})=> isActive ? "text-gold" : "text-white"} to="/account">Account</NavLink></li>}
      </ul>
  </nav>
}


export default Navbar