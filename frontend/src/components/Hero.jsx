import React from 'react'
import {Link} from "react-router-dom"
function Hero() {
  return <div className="relative bg-gray-900 h-screen w-screen flex items-center justify-center">
  <div className="px-10 flex flex-col items-center justify-center gap-4">
    <h1 className="text-5xl text-gold font-extrabold text-center">
      Prove Your Fingers' Agility!
    </h1>
    <p className="text-white text-center text-5xl z-20 w-7/12 font-bold py-8 ">
    Beat your best or challenge friends! Typing speed showdowns await. Ready to top the leaderboard?    </p>
    <button className="self-center drop-shadow-glowWhite bg-white p-4 rounded-lg text-black font-semibold hover:bg-gray-400 transition duration-300">
      <Link to="/challenges">START TYPING !</Link>
    </button>
  </div>
    {/* <img src="/assets/typewrite.svg" className="z-20 absolute  right-14 bottom-12 w-2/6 " alt='' /> */}
</div>
}

export default Hero;