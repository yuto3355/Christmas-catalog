import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaExternalLinkAlt, FaChevronRight } from 'react-icons/fa';

const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      const docRef = doc(db, 'presents', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setItem({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };
    fetchItem();
  }, [id]);

  if (loading) return <div className="text-center" style={{ marginTop: '50px' }}>Loading...</div>;
  if (!item) return <div className="text-center">商品が見つかりません</div>;

  return (
    <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '50px' }}>
      {/* パンくずリスト */}
      <nav style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#ccc' }}>
        <Link to="/" style={{ color: 'white' }}>ホーム</Link> <FaChevronRight size={10} /> 
        <Link to="/catalog" style={{ color: 'white' }}>カタログ</Link> <FaChevronRight size={10} /> 
        <span className="text-gold">{item.name}</span>
      </nav>

      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', md: { flexDirection: 'row' }, gap: '30px' }}>
          {/* 画像エリア */}
          <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', background: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
            <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>

          {/* 情報エリア */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '15px' }}>
                <span style={{ background: 'var(--accent-red)', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem', marginRight: '10px' }}>{item.category}</span>
                <span style={{ border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', padding: '4px 9px', borderRadius: '4px', fontSize: '0.8rem' }}>#{item.imageTag}</span>
            </div>
            
            <h1 style={{ fontSize: '1.8rem', marginTop: '0', marginBottom: '20px' }}>{item.name}</h1>
            {/* 価格表示は削除しました */}

            <div style={{ marginBottom: '30px', lineHeight: '1.6' }}>
              <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '10px' }}>ひとこと</h3>
              {/* 改行を反映させるスタイルを追加 */}
              <p style={{ whiteSpace: 'pre-wrap' }}>{item.description}</p>
            </div>

            <a href={item.purchaseUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
              購入ページへ <FaExternalLinkAlt />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;