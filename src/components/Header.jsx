import React from 'react';
import { Link } from 'react-router-dom';
import { FaTree } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      margin: '10px 20px',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FaTree size={28} color="var(--accent-gold)" />
        <h1 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>Christmas Catalog</h1>
      </Link>
      <nav style={{ display: 'flex', gap: '20px' }}>
        <Link to="/catalog" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
          🎁 プレゼント一覧
        </Link>
        <Link to="/admin" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
          ⚙️ 管理画面
        </Link>
      </nav>
    </header>
  );
};

export default Header;