
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';

import LandingPage from './pages/LandingPage';


function App() {
  const router = createBrowserRouter([
    {path : "/" , element : <RootLayout /> , children : [
      {index : true , element : <LandingPage />},
      {path : "/multiplayer" , element : <h2>online</h2>},
      {path : "/account" , element : <h2>account</h2>}
    ] }
  ])
  return <RouterProvider router={router} />

}
export default App;
