import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Account from './pages/Account';
import Games, { gamesLoader } from './pages/Games';
import LandingPage from './pages/LandingPage';
import Multiplayer, { multiplayerLoader } from './pages/Multiplayer';
import SoloGame, { speceficGameLoader } from './pages/SoloGame';
import AccountLayout from './layouts/AccountLayout';
import ContextUIProvider from "./store/ContextUIProvider";
import GameLayout from './layouts/GameLayout';
import Profile, { profileLoader } from './pages/Profile';
import  { useSocket } from "./store/SocketContextProvider";
import { useEffect } from 'react';
import { toast } from 'sonner';
import MultiplayerLayout from './layouts/MultiplayerLayout';
import OnlineGame, { onlineGameLoader } from './components/OnlineGame';


function App() {
  const socket = useSocket()
  useEffect(()=>{
    socket.on('connect', () => {
      console.log('Connected to server');
      // Set up event listeners here
    });
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
  });
    // return () => {
    //   socket.disconnect();
    //   console.log('Disconnected from server in APPjs');
    // };
 },[socket])

  const router = createBrowserRouter([
    {path : "/" , element : <RootLayout /> , children : [
      {index : true , element : <LandingPage />},
      {path : "/challenges" , element : <GameLayout /> , children : [
        {index : true , element : <Games /> , loader : gamesLoader },
        {path : "solo_game" , element : <SoloGame />},
        {path : ":challengeId" , element : <SoloGame /> , loader : speceficGameLoader}
      ]},
      {path : "/multiplayer" , element : <MultiplayerLayout /> , children : [
        {index:true,element : <Multiplayer /> , loader : multiplayerLoader},
        {path : "room/:roomId/:challengeId" , element : <OnlineGame /> , loader : onlineGameLoader}
      ]},
      {path : "/account" , element : <AccountLayout /> , children : [
        {index : true , element : <Account />},
        {path : "profile" , element : <Profile /> , loader : profileLoader}
      ]}
    ] }
  ])
  return <ContextUIProvider>
          <RouterProvider router={router} />
    </ContextUIProvider>
}
export default App;
