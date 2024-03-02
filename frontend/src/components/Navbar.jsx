import {useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { contextUI } from '../store/contextUI';
import { useSocket } from '../store/SocketContextProvider';

function Navbar() {
  const {loggedIn , handleLogout} = useContext(contextUI)
  const navigate = useNavigate()
  const socket= useSocket()
  const token = localStorage.getItem("userToken")

  return <nav className="bg-gray-900 font-bold text-white flex items-center justify-between pt-6 px-10">
            <h1 className='text-lg'>AM_FASTER</h1>
            <ul className='flex items-center justify-center text-lg gap-5 text-white px-6'>
            <li><NavLink className={({isActive})=> isActive ? "text-gold" : "text-white"} to="/">Home</NavLink></li>
            <li><NavLink className={({isActive})=> isActive ? "text-gold" : "text-white"} to="/challenges">Games</NavLink></li>
            <li><NavLink className={({isActive})=> isActive ? "text-gold" : "text-white"}  to="/multiplayer">Multiplayer</NavLink></li>
            <li><NavLink className={({isActive})=> isActive ? "text-gold" : "text-white"} to={(loggedIn || token ) ? "/account/profile" : "/account"}>{(loggedIn || token ) ? "Profile" : "Login/Register"}</NavLink></li>
      </ul>
  </nav>
}


export default Navbar