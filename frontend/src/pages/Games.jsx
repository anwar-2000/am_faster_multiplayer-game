import React from 'react'
import GameCard from "../components/GameCard"

function Games() {
  return <>
  <h1 className='px-8 pb-4 pt-24 text-white text-3xl'>Tech : </h1>
  <div className='w-full  px-8  flex flex-wrap  items-center justify-start gap-10'>
        <GameCard />
        <GameCard />
        <GameCard />
  </div>
  <h1 className='pt-8 px-8 pb-4 text-white text-3xl'>History : </h1>
  <div className='w-full pb-24 px-8  flex flex-wrap  items-center justify-start gap-10'>
        <GameCard />
        <GameCard />
        <GameCard />
        <GameCard />
  </div>
  </>
}

export default Games