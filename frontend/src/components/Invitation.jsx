import React from 'react'
import { CiCircleCheck } from 'react-icons/ci';
import { MdDoNotDisturbOn } from 'react-icons/md';
import { toast } from 'sonner';
import { useSocket } from '../store/SocketContextProvider'

function Invitation({socket,invitation}) {
    //const socket = useSocket()
    if (!socket) {
      return  toast.error('Socket context is undefined. Make sure SocketContextProvider is properly configured.');
    }

    function handleDecision (decision) {
        if(decision === "accept"){
            socket.emit("invitationAccepted",(invitation))
            return;
        }
        socket.emit("invitationRejected",(invitation))
    }   
  return (
    <div className='flex items-center justify-center gap-4'>
        <h6>{invitation.sender_username}has invited you to a  game</h6>
        <CiCircleCheck color='green' onClick={()=>handleDecision("accept")}/>
        <MdDoNotDisturbOn color='red' onClick={()=>handleDecision("reject")} />
    </div>
  )
}

export default Invitation