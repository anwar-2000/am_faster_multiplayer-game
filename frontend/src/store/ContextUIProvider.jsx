import {useState} from 'react'
import { contextUI } from './contextUI'


function ContextUIProvider({children}) {
    const [states, setStates] = useState({
        loggedIn : false,
        username : "",
        sender : "",
        recipient : ""
    })

    const handleLogin = (username) => {
        setStates(prevStates => ({ ...prevStates, loggedIn: true , username }));
      };
    
      const handleLogout = () => {
        setStates(prevStates => ({ ...prevStates, loggedIn: false , username :""}));
      };
      const handleCreateRoom = (sender,recipient)=>{
        setStates((prev)=>({...prev,sender : sender , recipient}))
      }
    const contextValue = {
        loggedIn : states.loggedIn,
        handleLogin,
        handleLogout,
        username : states.username,
        handleCreateRoom,
        sender : states.sender,
        recipient : states.recipient
    }
  return (
    <contextUI.Provider value={contextValue}>
        {children}
    </contextUI.Provider>
  )
}

export default ContextUIProvider