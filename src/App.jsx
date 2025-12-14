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
      {/* SnowEffectを背景画像(z:-1)より手前、コンテンツ(z:1)より後ろの0に配置 */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
        <SnowEffect />
      </div>
      
      {/* ヘッダーやコンテンツは zIndex: 1 以上で表示 */}
      <div style={{ position: 'relative', zIndex: 1 }}>
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
    </div>
  );
}

export default App;