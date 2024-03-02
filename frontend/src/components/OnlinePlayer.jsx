import { useContext  , useRef} from 'react'
import { contextUI } from '../store/contextUI'
import { useSocket } from '../store/SocketContextProvider'

function OnlinePlayer({challenges,player}) {
  //console.log("ONLINE PLAYER CARD",challenges)
  const socket = useSocket()
  const {username} = useContext(contextUI)
  const challengeRef= useRef()

  const handleInvite = () => {
    socket.emit("sendInvitation",({
      challengeId : parseInt(challengeRef.current.value) ,
      recipientId : player.id,
      recipientUsername : player.username,
      sender_username : username,
      senderId : 1
    }))
  }
  return <tr className=''>
        <td className='text-gold text-center'>{player.username}</td>
        <td className='grid place-items-center'>
        <select ref={challengeRef} className='bg-transparent outline-none border-none text-white p-4' name="" id="">
           <option value="">Select a challenge</option>
           {challenges.map((challenge)=>(
              <option className='bg-black text-white' key={challenge.id} value={challenge.id}>{challenge.category} - {challenge.difficulty}</option>
           ))}
        </select>
        </td>
        <td className=''>
        <button className=' w-11/12 px-6 py-2 bg-blue-500 rounded-md gont-bold text-white' onClick={handleInvite}>Invite</button>
        </td>
  </tr>
  
}

export default OnlinePlayer