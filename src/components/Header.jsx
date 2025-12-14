import React from 'react';
import { Link } from 'react-router-dom';
import { FaTree } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      margin: '10px 10px', // マージンを少し詰める
      padding: '10px 15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FaTree size={24} color="var(--accent-gold)" />
        {/* スマホでタイトルが長すぎないよう調整 */}
        <h1 style={{ margin: 0, fontSize: '1.1rem', color: 'white', whiteSpace: 'nowrap' }}>
          Christmas Catalog
        </h1>
      </Link>
      <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {/* whiteSpace: 'nowrap' で改行を禁止、fontSizeを調整 */}
        <Link to="/catalog" style={{ 
          color: 'white', 
          textDecoration: 'none', 
          fontWeight: 'bold',
          fontSize: '0.9rem',
          whiteSpace: 'nowrap' 
        }}>
          🎁 カタログ
        </Link>
        <Link to="/admin" style={{ 
          color: 'rgba(255,255,255,0.7)', 
          textDecoration: 'none',
          fontSize: '0.8rem',
          whiteSpace: 'nowrap'
        }}>
          ⚙️ 管理
        </Link>
      </nav>
    </header>
  );
};

export default Header;