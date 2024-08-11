import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Home from './pages/Home'
import NavBar from "./pages/NavBar";
import RecipePage from "./pages/RecipePage";
import Favorites from "./pages/Favorites";
import About from "./pages/About";
import CreateUser from "./pages/CreateUser";
import PersonalPage from "./pages/Personal_Page";



function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path ='recipes' element={<RecipePage/>}/>
          <Route path='favorites' element={<Favorites/>}/>
          <Route path='about' element={<About/>}/>
          <Route path='create_user' element={<CreateUser/>}/>
          <Route path='personal_page' element={<PersonalPage/>}/>
        </Route>
    
      </Routes>
    </div>
  );
}

function Layout() {
  return (
    <div>
      <NavBar/>
      <Outlet/>
    </div>
  )
}
export default App;
