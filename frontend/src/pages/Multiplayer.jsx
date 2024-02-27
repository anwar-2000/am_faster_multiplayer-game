import React from 'react'
import { useLoaderData } from 'react-router-dom'
import OnlinePlayer from '../components/OnlinePlayer'

function Multiplayer() {
  const {online_users} = useLoaderData()
  console.log(online_users)
  return <div className="w-full flex items-start justify-start flex-wrap">
    <h1 className='text-4xl text-white font-extrabold self-center w-full p-4'>Invite online people to a game !</h1>
    <div className="w-full p-8 flex items-start justify-start gap-4 flex-wrap">
        {online_users ? online_users.map((user,i)=>{
           return <OnlinePlayer player={user} key={i} />
        }) : <h1>No user is online</h1>}
    </div>
  </div>
}

export default Multiplayer

export const multiplayerLoader = async () => {
  try {
    const response = await fetch("http://localhost:8000/users/online",{
      headers : {
        "Content-type" : "application/json"
      }
    })
    if(!response.ok){
      const errorData = await response.json()
      console.log(errorData.message)
      return null ;
    }
    const data = await response.json()
    //console.log("loader data",data)
    return data;
  } catch (error) {
    console.log(error)
  }

}