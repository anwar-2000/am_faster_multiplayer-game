import {useState} from 'react'
import { contextUI } from './contextUI'


function ContextUIProvider({children}) {
    const [UI_states, setUIStates] = useState({
        loggedIn : false
    })

    const handleLogin = () => {
        setUIStates(prevStates => ({ ...prevStates, loggedIn: true }));
      };
    
      const handleLogout = () => {
        setUIStates(prevStates => ({ ...prevStates, loggedIn: false }));
      };
    const contextValue = {
        loggedIn : UI_states.loggedIn,
        handleLogin,
        handleLogout
    }
  return (
    <contextUI.Provider value={contextValue}>
        {children}
    </contextUI.Provider>
  )
}

export default ContextUIProvider