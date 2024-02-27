import {useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
function Register() {
    const navigate = useNavigate()
    const username_ref = useRef(null)
    const email_ref = useRef(null)
    const password_ref = useRef(null)

    const handleSubmit = async (event) => {
        event.preventDefault()
        // TODO :  control values passed
        try {
            const response = await fetch("http://localhost:8000/users",{
                method : "POST",
                headers : {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    email : email_ref.current.value,
                    username : username_ref.current.value,
                    password : password_ref.current.value
                })
            })
            if(!response.ok){
                const errorData = await response.json()
                toast.error(errorData.message)
                return;
            }
            navigate("/account")
            toast.success("Great ! log in now ...")
        } catch (error) {
            console.log(error)
            return;
        }
    }
  return <div className='w-full'>
                <h1>Create your account</h1>
                <form onSubmit={handleSubmit} className='w-full flex flex-col items-center  justify-start gap-4'>
                    <input type="text" ref={username_ref} placeholder='Username' name='username' className='w-full border-2 border-black rounded-md py-4 pl-2' />
                    <input type="email" ref={email_ref} placeholder='Email' name='email' className='w-full border-2 border-black rounded-md py-4 pl-2' />
                    <input type="password" ref={password_ref} placeholder='Password' name='password' className='w-full border-2 border-black rounded-md py-4 pl-2'/>
                    <input type="password" placeholder='Confirm password' name='password_confirm' className='w-full border-2 border-black rounded-md py-4 pl-2'/>
                    <button className='self-center bg-gold py-4 px-10 rounded-lg '>Submit</button>
                </form>
            </div>
}

export default Register