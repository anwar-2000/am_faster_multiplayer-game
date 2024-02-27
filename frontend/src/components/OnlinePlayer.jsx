import React from 'react'
import { useSocket } from '../store/SocketContextProvider'

function OnlinePlayer({player}) {
  const socket = useSocket()
  const handleInvite = () => {
    socket.emit("sendInvitation",({
      recipientUsername : player.id
    }))
  }
    //console.log(player)
  return <div className='flex items-center justify-between gap-4 bg-slate-700 rounded-lg p-4'>
        <h4 className='text-white'>{player.username}</h4>
        <button className='px-6 py-2 bg-blue-500 rounded-md gont-bold text-white' onClick={handleInvite}>Invite</button>
  </div>
  
}

export default OnlinePlayer