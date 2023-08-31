import { BrowserRouter, Routes, Route } from "react-router-dom";
import AudioList from "./pages/AudioList";
import Intro from "./pages/Intro";
import Collect from "./pages/Collect";


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element= {<Intro/>}/>
      <Route path="/collect" element ={<Collect/>}/>
      <Route path = "/audiolist" element= {<AudioList/>}/>
    </Routes>
    </BrowserRouter>)}

    export default App