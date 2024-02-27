import { createContext } from "react";

export const contextUI = createContext({
    loggedIn : false,
    handleLogin : ()=>{},
    handleLogout : () => {}
    
})