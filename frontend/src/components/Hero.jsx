import React from 'react'

function Hero() {
  return <div className="relative bg-gray-900 h-screen w-screen flex items-center justify-start">
  <div className="px-10 flex flex-col items-center justify-start gap-4">
    <h1 className="text-5xl text-gold font-extrabold self-start">
      Prove Your Fingers' Agility!
    </h1>
    <p className="text-white self-start text-5xl w-6/12 font-bold py-8 ">
    Beat your best or challenge friends! Typing speed showdowns await. Ready to top the leaderboard?    </p>
    <button className="self-start drop-shadow-glowWhite bg-white p-4 rounded-lg text-black font-semibold hover:bg-gray-400 transition duration-300">
      START TYPING !
    </button>
  </div>
    <img src="/assets/hero_image.png" className="transform z-20 rotate-6 origin-left absolute bottom-30 right-0 w-6/6 " alt='' />
</div>
}

export default Hero;