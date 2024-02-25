import React from 'react'
import GameCard from "../components/GameCard"
import { useLoaderData , json } from 'react-router-dom';
function Games() {
  const {challenges} = useLoaderData();
  //console.log(challenges)
  return <>
  <div className='w-full  px-8 py-24 flex flex-wrap  items-center justify-start gap-10'>
        {challenges.map((challenge,i)=>(
          <GameCard id={challenge.id} category={challenge.category} difficulty={challenge.difficulty} text={challenge.text_content}  key={i}/>
        ))}
  </div>
  </>
}

export default Games

export const gamesLoader =  async () =>{
  const response = await fetch("http://localhost:8000/challenges")
  if(!response.ok){
      throw json(
        {
          message : response.message
        }
      )
  }
  const data = await response.json();
  //console.log("LOADER : ",data)
  return data;
}