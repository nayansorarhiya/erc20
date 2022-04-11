import React from 'react';
import Home from './components/Home';
import Welcome from './components/Welcome';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Welcome />} />
          <Route path='/:contractAddress' element={<Home />} />
        </Routes>
      </BrowserRouter>


    </>
  );
}

export default App;
