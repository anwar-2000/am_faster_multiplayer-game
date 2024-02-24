import React from 'react'
import GameCard from "../components/GameCard"

function Games() {
  return <>
  <div className='w-full  px-8 py-24 flex flex-wrap  items-center justify-start gap-10'>
        <GameCard />
        <GameCard />
        <GameCard />
        <GameCard />
        <GameCard />
        <GameCard />
        <GameCard />
  </div>
  </>
}

export default Games