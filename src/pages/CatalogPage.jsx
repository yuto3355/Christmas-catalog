import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaRandom, FaUndo, FaChevronRight, FaTimes, FaExternalLinkAlt, FaRedo } from 'react-icons/fa';

const CatalogPage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [categoryFilter, setCategoryFilter] = useState('');
  const [imageTagFilter, setImageTagFilter] = useState('');

  // ランダムモーダル用ステート
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [randomItem, setRandomItem] = useState(null);

  const categories = ['飲食物', '文房具', '日用品', '本', 'エンタメ'];
  const imageTags = ['癒し', 'ユニーク', '便利', 'おしゃれ', '学び', 'ワクワク'];

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'presents'));
      const itemList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(itemList);
      setFilteredItems(itemList);
      setLoading(false);
    };
    fetchItems();
  }, []);

  useEffect(() => {
    let result = items;
    if (categoryFilter) {
      result = result.filter(item => item.category === categoryFilter);
    }
    if (imageTagFilter) {
      result = result.filter(item => item.imageTag === imageTagFilter);
    }
    setFilteredItems(result);
  }, [categoryFilter, imageTagFilter, items]);

  const handleReset = () => {
    setCategoryFilter('');
    setImageTagFilter('');
  };

  // ランダムロジック（モーダル表示）
  const handleRandom = () => {
    if (items.length > 0) {
      // 現在のフィルタリングに関わらず、全アイテムから選ぶか、フィルタ内から選ぶか
      // ここでは「全アイテムから」選ぶ仕様にします（「サンタにおまかせ」なので）
      const item = items[Math.floor(Math.random() * items.length)];
      setRandomItem(item);
      setShowRandomModal(true);
    }
  };

  return (
    <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '80px' }}>
      
      {/* パンくずリスト */}
<nav style={{ 
  marginBottom: '20px', 
  fontSize: '0.9rem', 
  color: '#ccc', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '5px',
  
  /* --- ★ここから追記・変更 --- */
  position: 'sticky',   // 固定する設定
  top: '70px',          // 上のヘッダーの高さ分あける（環境に合わせて調整！）
  zIndex: 100,          // 他の要素より手前に
  backgroundColor: '#1a4d3e', // 透けないように背景色を指定（画面の背景色に合わせてください）
  padding: '10px 0',    // 少し上下に余白をつけて見やすく
  /* --- ★ここまで --- */
}}>
  <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>ホーム</Link> 
  <FaChevronRight size={10} /> 
  <span className="text-gold">カタログ</span>
</nav>

      {/* コントロールバー */}
<div className="glass-panel" style={{ 
  padding: '15px', 
  marginBottom: '30px', 
  display: 'flex', 
  flexWrap: 'wrap', 
  gap: '10px', 
  alignItems: 'center', 
  justifyContent: 'center',
  
  /* --- ★ここから追記・変更 --- */
  position: 'sticky',
  top: '120px',         // ヘッダー(60px) + パンくず(約40px) = 100px
  zIndex: 90,           // パンくずよりは少し後ろ、リストよりは手前
  backgroundColor: '#1a4d3e', // ここも透けないように背景色を指定
  /* --- ★ここまで --- */
}}>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ width: 'auto', margin: 0, padding: '8px' }}>
          <option value="">全カテゴリ</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={imageTagFilter} onChange={(e) => setImageTagFilter(e.target.value)} style={{ width: 'auto', margin: 0, padding: '8px' }}>
          <option value="">全イメージ</option>
          {imageTags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleReset} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
            <FaUndo /> リセット
          </button>
          <button onClick={handleRandom} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '5px', borderRadius: '8px', padding: '8px 16px', fontSize: '0.9rem' }}>
            <FaRandom /> おまかせ
          </button>
        </div>
      </div>

      {/* グリッド表示 */}
      {loading ? (
        <p className="text-center">Loading presents...</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '15px'
        }}>
          {filteredItems.map(item => (
            <Link to={`/item/${item.id}`} key={item.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-panel" style={{ height: '100%', overflow: 'hidden', transition: 'transform 0.2s', cursor: 'pointer', display: 'flex', flexDirection: 'column' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                <div style={{ height: '140px', background: '#fff', overflow: 'hidden' }}>
                  <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '10px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', marginBottom: '4px' }}>
                      {item.category}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.3' }}>{item.name}</h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      {filteredItems.length === 0 && !loading && <p className="text-center">プレゼントが見つかりませんでした...</p>}

      {/* --- ランダムポップアップ（モーダル） --- */}
      {showRandomModal && randomItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.8)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ 
            background: 'rgba(20, 40, 30, 0.95)', 
            border: '2px solid var(--accent-gold)',
            width: '100%', 
            maxWidth: '350px', 
            position: 'relative',
            padding: '0',
            overflow: 'hidden',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)'
          }}>
            {/* 閉じるボタン (右上) */}
            <button 
              onClick={() => setShowRandomModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <FaTimes />
            </button>

            {/* モーダルコンテンツ */}
            <div style={{ height: '200px', background: '#fff' }}>
              <img src={randomItem.imageUrl} alt={randomItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', marginBottom: '5px' }}>
                Santa's Choice! 🎅
              </div>
              <h2 style={{ fontSize: '1.4rem', margin: '0 0 20px 0' }}>{randomItem.name}</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link 
                  to={`/item/${randomItem.id}`} 
                  className="btn-primary" 
                  style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                >
                  詳細にとぶ <FaExternalLinkAlt />
                </Link>
                
                <button 
                  onClick={handleRandom} 
                  className="btn-secondary" 
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.5)' }}
                >
                  <FaRedo /> 続けてランダムに表示
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;