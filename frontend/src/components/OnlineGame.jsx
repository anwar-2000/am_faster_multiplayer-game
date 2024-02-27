import { useContext } from 'react';
import { useEffect } from 'react';
import {useState} from 'react'
import { useLoaderData } from 'react-router-dom'
import { toast } from 'sonner';
import { contextUI } from '../store/contextUI';
import { useSocket } from '../store/SocketContextProvider';
import Game from './Game'

function OnlineGame() {
    const socket = useSocket()
    const [ready, setReady] = useState(false);
    const {challenge,roomId} = useLoaderData();
    const {username} = useContext(contextUI);

   // console.log(challenge)
   const handleReady = () =>{
      socket.emit("userReady",({username,roomId}))
   }
   useEffect(() => {
    socket.on("startGame",()=>{
        setReady(true)
    })
    socket.on("onUserIsReady",(username)=>{
        toast.success(`${username} is ready !`)
    })
   }, [socket]);
  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col mt-14'>
        {!ready && <button type="button" onClick={handleReady} className='bg-white rounded-lg text-gold px-8 py-2'>Am Ready</button>}
        <div className={`${!ready && "opacity-20  -z-10"}`}>
        <Game text={challenge.text_content} id={challenge.id} category={challenge.category} difficulty={challenge.difficulty} />
        </div>
    </div>
  )
}

export default OnlineGame

export async function onlineGameLoader ({params}) {
    const {challengeId, roomId} = params
    const response = await fetch(`http://localhost:8000/challenges/${challengeId}`)
    if(!response.ok){
        throw new Error("Error fetching the challenge")
    }
    const data = await response.json()
    const {challenge} = data
    const gameInfos = {
        challenge,
        roomId
    }
    return gameInfos;
}