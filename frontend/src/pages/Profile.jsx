import { useLoaderData, useNavigate } from "react-router-dom"
import UserPlayedGames from "../components/UserPlayedGames"
import UserPlayedGame from "../components/UserPlayedGame"
import OnlinePlayedGames from "../components/OnlinePlayedGames"
import OnlinePlayedGame from "../components/OnlinePlayedGame"
import { useSocket } from "../store/SocketContextProvider"
import { useContext } from "react"
import { contextUI } from "../store/contextUI"

function Profile() {
  const socket = useSocket()
  const {handleLogout} = useContext(contextUI)
  const navigate = useNavigate()
  const {played_games} = useLoaderData()
  const token = localStorage.getItem("userToken")
  const logoutHandler = async () => {
    const response = await fetch("http://localhost:8000/auth/logout",{
       method : "POST",
       headers : {
           "authorization": `Bearer ${token}`,
           "Content-type" : "application/json"
       }
    })
    if(!response.ok){
        const errorData = await response.json()
        console.log(errorData.message)
        return;
    }
    localStorage.removeItem("userToken")
    handleLogout()
    socket.disconnect();
    navigate("/")
}
  return (
    <div className=" relative w-full h-screen px-8 pt-14 flex flex-wrap items-center justify-start gap-4 ">
         <button className="absolute top-14 right-32 text-white bg-orange-400 rounded-md px-6 " onClick={logoutHandler}>Log Out</button>
        <div className="w-full">
            <h1  className="text-xl text-white pl-8">User INFOS AND SETTINGS to fetch</h1>
        </div>
        <UserPlayedGames>
            {played_games.map((playedGame,i)=>(
              <UserPlayedGame key={i} category={playedGame.category} date={playedGame.game_date} difficulty={playedGame.difficulty} mistakes={playedGame.mistakes} time={playedGame.time}/>
            ))}
        </UserPlayedGames>
        <OnlinePlayedGames>
        {played_games.map((playedGame,i)=>(
              <OnlinePlayedGame key={i}  category={playedGame.category} date={playedGame.game_date} difficulty={playedGame.difficulty} mistakes={playedGame.mistakes} time={playedGame.time}/>
            ))}
        </OnlinePlayedGames>
    </div>
  )
}

export default Profile

export const profileLoader =  async () =>{
    const userToken = localStorage.getItem("userToken")
    try {
      const response = await fetch("http://localhost:8000/games/",{
        headers : {
          "Authorization" : `Bearer ${userToken}`,
          "Content-type" : "application/json"
        }
      })
      if(!response.ok){
          const errorData = await response.json()
          console.log(errorData.message)
          return;
      }
      const data = await response.json()
      return data;
    } catch (error) {
      console.log(error)
    }
}