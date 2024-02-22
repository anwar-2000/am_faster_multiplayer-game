
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Account from './pages/Account';
import Games from './pages/Games';
import LandingPage from './pages/LandingPage';
import Multiplayer from './pages/Multiplayer';
import SoloGame from './pages/SoloGame';


function App() {
  const router = createBrowserRouter([
    {path : "/" , element : <RootLayout /> , children : [
      {index : true , element : <LandingPage />},
      {path : "/games" , element : <Games />},
      {path : "/solo_game" , element : <SoloGame />},
      {path : "/multiplayer" , element : <Multiplayer />},
      {path : "/account" , element : <Account />}
    ] }
  ])
  return <RouterProvider router={router} />
}
export default App;
