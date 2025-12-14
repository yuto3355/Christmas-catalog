import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SnowEffect from './components/SnowEffect';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ItemDetailPage from './pages/ItemDetailPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <div className="App">
      <SnowEffect />
      <Header />
      <main style={{ paddingBottom: '50px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/item/:id" element={<ItemDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;