import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Landing } from './pages/Landing.pages.tsx'
import { Game } from './pages/Game.pages.tsx'


function App() {

  return (

    <>
        <BrowserRouter>
            <Routes>
                <Route path='/'element= {<Landing />}/>
                <Route path='/Game'element = { <Game/>}/>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
