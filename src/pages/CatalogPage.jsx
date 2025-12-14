import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaRandom, FaUndo } from 'react-icons/fa';

const CatalogPage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [categoryFilter, setCategoryFilter] = useState('');
  const [imageTagFilter, setImageTagFilter] = useState('');

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

  const handleRandom = () => {
    if (items.length > 0) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setCategoryFilter(randomItem.category);
      setImageTagFilter(randomItem.imageTag);
      setFilteredItems([randomItem]); 
    }
  };

  return (
    <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '80px' }}>
      {/* コントロールバー */}
      <div className="glass-panel" style={{ padding: '15px', marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
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
          // ここを調整：最小幅を140pxにしてスマホで2列表示を実現
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
                  {/* 価格表示を削除しました */}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      {filteredItems.length === 0 && !loading && <p className="text-center">プレゼントが見つかりませんでした...</p>}
    </div>
  );
};

export default CatalogPage;