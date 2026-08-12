import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Landing } from './pages/Landing.pages.tsx'
import { Game } from './pages/Game.pages.tsx'
import { Signup } from './pages/Signup.pages.tsx'
import { Signin } from './pages/Signin.pages.tsx'


function App() {

  return (

    <>
        <BrowserRouter>
            <Routes>
                <Route path='/'element= {<Landing />}/> 
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path='/Game'element = { <Game/>}/>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
