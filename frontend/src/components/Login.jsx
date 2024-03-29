import {useContext, useRef} from 'react'
import {useNavigate} from "react-router-dom"
import { toast } from 'sonner'
import { contextUI } from '../store/contextUI'
import { useSocket } from '../store/SocketContextProvider'

function Login() {
    const navigate = useNavigate()
    const username_ref = useRef(null)
    const password_ref = useRef(null)
    const {handleLogin} = useContext(contextUI)
    const socket = useSocket()

    const handleSubmit = async (event) =>{
        event.preventDefault()
        const username = username_ref.current.value
        const password = password_ref.current.value
        // TODO :  control values passed
        try {
            const response = await fetch("http://localhost:8000/auth/login",{
                method : "POST",
                headers : {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    username ,
                    password 
                })
            })
            if(!response.ok){
                const errorData = await response.json()
                toast.error(errorData.message)
                return;
            }
            const data = await response.json();
            const { token } = data;
            localStorage.setItem("userToken",token)
            socket.emit("login", username);
            handleLogin(username) // update navbar UI
            toast.success("Welcome !")
            //emitting socket login to attach its id to username
            //console.log("Emmiting username !!!")
            //socket.emit("test")
            navigate("profile")
        } catch (error) {
            console.log(error)
            return;
        }
    }
  return (
            <div className='w-full'>
                <h1>Welcome Back !</h1>
                <form onSubmit={handleSubmit} className='w-full flex flex-col items-center  justify-start gap-4'>
                    <input ref={username_ref} type="text" placeholder='Username' name='username' className='w-full border-2 border-black rounded-md py-4 pl-2' />
                    <input ref={password_ref} type="password" placeholder='Password' name='password' className='w-full border-2 border-black rounded-md py-4 pl-2'/>
                    <button className='self-center bg-gold py-4 px-10 rounded-lg '>Login</button>
                </form>
            </div>
  )
}

export default Login