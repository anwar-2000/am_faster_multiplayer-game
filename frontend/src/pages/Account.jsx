import {useState} from 'react'
import Login from '../components/Login'
import Register from '../components/Register'

function Account() {
  const [form, setForm] = useState("register")
  return (
    <div className='w-full h-screen grid place-items-center'>
      <div className="w-2/5 drop-shadow-glowWhite flex flex-col items-start justify-start gap-3 bg-white p-8 rounded-xl">
         {form === "register" ? <>
         <Register />
          <small className='underline text-blue-800 cursor-pointer' onClick={()=>setForm("login")}>I already have an account</small> 
          </>
          : <>
              <Login />
              <small className='underline text-blue-800 cursor-pointer' onClick={()=>setForm("register")}>I want to create an account </small> 
          </>
          }
      </div>
    </div>
  )
}

export default Account