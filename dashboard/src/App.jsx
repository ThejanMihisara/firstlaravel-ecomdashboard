import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './Header.jsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login.jsx';
import Register from './pages/Register.jsx';
import AddProduct from './pages/AddProduct.jsx';
import UpdateProduct from './pages/UpdateProduct.jsx';
import Home from './pages/Home.jsx';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user-info');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Header user={user} onLogout={() => setUser(null)} />
        <Routes>
          <Route path="/" element={user ? <Home user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add" element={user ? <AddProduct user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/update" element={user ? <UpdateProduct user={user} /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to={user ? '/home' : '/login'} replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
