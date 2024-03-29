import {useEffect} from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import OnlinePlayer from '../components/OnlinePlayer'
import {useQuery} from "@tanstack/react-query"
import { gamesLoader } from './Games'
import { useSocket } from '../store/SocketContextProvider'
import { toast } from 'sonner'
import { useContext } from 'react'
import { contextUI } from '../store/contextUI'

function Multiplayer() {
  const navigate = useNavigate()
  const {online_users} = useLoaderData()
  //console.log(online_users)
  const socket = useSocket()
  const {handleCreateRoom} = useContext(contextUI)
  const { isPending, error, data } = useQuery({
    queryKey: ['challenges'],
    queryFn: gamesLoader
  })

  useEffect(() => {
    socket.on('receiveInvitation', (invitation) => {
      toast.info(`${invitation.sender_username} has invited you to a game !`, {
       action: {
         label: 'Accept',
         onClick: () => socket.emit("invitationAccepted",(invitation))
       },
       onDismiss: (t) => socket.emit("invitationRejected",invitation),
     })
     });
     socket.on("heRejectedYou", (invitation) => {
       toast.error(`${invitation.recipientUsername} rejected your invitation`)
       //console.log(invitation)
     })
     socket.on("goToGame", (gameInfos)=>{
       //console.log("GO TO GAME INFOS :",gameInfos)
        toast.message(`Joined room : ${gameInfos.roomId}`)
        //TODO : storing usernames instead of id... for game save later
        handleCreateRoom(gameInfos.senderId,gameInfos.recipientId)
        // go to game page
        navigate(`/multiplayer/room/${gameInfos.roomId}/${gameInfos.challengeId}`)
     })
     socket.on("user_not_found",()=>{
      toast.info("The user you invited is having network Errors")
     })
  }, [socket]);
  
  return <div className="w-full flex items-start justify-start flex-wrap pt-14">
    <h1 className='text-2xl text-center text-white font-extrabold self-center w-full p-4'>Let&apos; see how you handle real people !</h1>
    {isPending ? 
    <div className="w-full bg-slate-400 animate-pulse"></div> 
        :
     <div className="w-full p-8 flex items-start justify-start gap-4 flex-wrap">
        {online_users && online_users.length >= 1
         ? <table className='w-full'>
            <thead className='text-blue-400 '>
              <th>Username</th>
              <th>Challenge</th>
              <th>Invite</th>
            </thead>
            <tbody>
            {online_users.map((user,i)=>{
           return <OnlinePlayer challenges={data.challenges} player={user} key={i} />
               })}
            </tbody>
         </table>
         : <h1>No user is online</h1>}
    </div>}
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
    return data || [];
  } catch (error) {
    console.log(error)
  }

}