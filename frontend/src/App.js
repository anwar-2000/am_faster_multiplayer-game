import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Account from './pages/Account';
import Games from './pages/Games';
import LandingPage from './pages/LandingPage';
import Multiplayer from './pages/Multiplayer';
import SoloGame from './pages/SoloGame';
import AccountLayout from './layouts/AccountLayout';
import ContextUIProvider from "./store/ContextUIProvider";
import GameLayout from './layouts/GameLayout';

function App() {
  const router = createBrowserRouter([
    {path : "/" , element : <RootLayout /> , children : [
      {index : true , element : <LandingPage />},
      {path : "/games" , element : <GameLayout /> , children : [
        {index : true , element : <Games />},
        {path : "solo_game" , element : <SoloGame />}
      ]},
      {path : "/multiplayer" , element : <Multiplayer />},
      {path : "/account" , element : <AccountLayout /> , children : [
        {index : true , element : <Account />},
        {path : "profile" , element : <h1>Profile</h1>}
      ]}
    ] }
  ])
  return <ContextUIProvider>
      <RouterProvider router={router} />
    </ContextUIProvider>
}
export default App;
