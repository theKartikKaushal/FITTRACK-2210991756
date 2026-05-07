import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';

import"./App.css"
import Feature from './components/Feature';
import Health from './components/Health';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="feature" element={<Feature />} />
          <Route path="health" element={<Health />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />

          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
