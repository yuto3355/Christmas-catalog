import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaGift, FaRandom, FaUndo } from 'react-icons/fa';

const CatalogPage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [categoryFilter, setCategoryFilter] = useState('');
  const [imageTagFilter, setImageTagFilter] = useState('');

  // 選択肢定義
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

  // フィルタリング処理
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

  // リセット
  const handleReset = () => {
    setCategoryFilter('');
    setImageTagFilter('');
  };

  // サンタにおまかせ（ランダム）
  const handleRandom = () => {
    if (items.length > 0) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setCategoryFilter(randomItem.category);
      setImageTagFilter(randomItem.imageTag);
      // UXとして、ランダムに選ばれたものだけ表示する
      setFilteredItems([randomItem]); 
    }
  };

  return (
    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      {/* コントロールバー */}
      <div className="glass-panel" style={{ padding: '15px', marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', justifyContent: 'center' }}>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ width: 'auto', margin: 0 }}>
          <option value="">全カテゴリ</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={imageTagFilter} onChange={(e) => setImageTagFilter(e.target.value)} style={{ width: 'auto', margin: 0 }}>
          <option value="">全イメージ</option>
          {imageTags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <button onClick={handleReset} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <FaUndo /> リセット
        </button>
        <button onClick={handleRandom} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '5px', borderRadius: '8px', padding: '8px 16px', fontSize: '1rem' }}>
          <FaRandom /> サンタにおまかせ
        </button>
      </div>

      {/* グリッド表示 */}
      {loading ? (
        <p className="text-center">Loading presents...</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {filteredItems.map(item => (
            <Link to={`/item/${item.id}`} key={item.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-panel" style={{ height: '100%', overflow: 'hidden', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                <div style={{ height: '180px', background: '#fff', overflow: 'hidden' }}>
                  <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '15px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginBottom: '5px' }}>
                    {item.category} / {item.imageTag}
                  </div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>{item.name}</h3>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>¥{Number(item.price).toLocaleString()}</div>
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