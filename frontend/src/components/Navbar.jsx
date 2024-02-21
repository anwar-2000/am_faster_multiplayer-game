import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return <nav className="bg-gray-900 font-bold text-white flex items-center justify-between pt-6 px-10">
            <h1 className='text-lg'>AM_FASTER</h1>
            <ul className='flex items-center justify-center text-lg gap-5 text-white px-6'>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/multiplayer">Multiplayer</Link></li>
            <li><Link to="/account">Account</Link></li>
      </ul>
  </nav>
}


export default Navbar