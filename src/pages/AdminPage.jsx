import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FaLock, FaTrash } from 'react-icons/fa';

const AdminPage = () => {
  const ADMIN_PASSWORD = "xmas2025"; 

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // 商品リスト管理用
  const [presents, setPresents] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  // price をステートに復活
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    imageUrl: '',
    purchaseUrl: '',
    category: '飲食物',
    imageTag: '癒し',
    description: ''
  });
  const [message, setMessage] = useState('');

  const fetchPresents = async () => {
    setLoadingList(true);
    const querySnapshot = await getDocs(collection(db, 'presents'));
    const itemList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPresents(itemList);
    setLoadingList(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPresents();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (inputPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('パスワードが違います');
      setInputPassword('');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('送信中...');
    
    try {
      await addDoc(collection(db, 'presents'), {
        ...formData,
        price: Number(formData.price), // データベースには保存する
        createdAt: new Date()
      });
      setMessage('✅ 登録しました！');
      // 次の入力のためにフォームをクリア（カテゴリなどは維持）
      setFormData({ ...formData, name: '', price: '', imageUrl: '', purchaseUrl: '', description: '' }); 
      fetchPresents();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setMessage('❌ エラーが発生しました');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('本当に削除しますか？')) return;
    try {
      await deleteDoc(doc(db, 'presents', id));
      setPresents(presents.filter(item => item.id !== id));
      alert('削除しました');
    } catch (error) {
      console.error(error);
      alert('削除に失敗しました');
    }
  };

  // --- 認証前のロック画面 ---
  if (!isAuthenticated) {
    return (
      <div className="container flex-center" style={{ height: '60vh', position: 'relative', zIndex: 1 }}>
        <div className="glass-panel" style={{ padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <FaLock size={40} color="var(--accent-gold)" style={{ marginBottom: '20px' }} />
          <h2 style={{ marginTop: 0 }}>管理者アクセス</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              value={inputPassword} 
              onChange={(e) => setInputPassword(e.target.value)} 
              placeholder="Password"
              style={{ textAlign: 'center', fontSize: '1.2rem' }}
            />
            {loginError && <p style={{ color: 'var(--accent-red)', fontWeight: 'bold' }}>{loginError}</p>}
            <button type="submit" className="btn-primary" style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }}>
              解除
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- 認証後の登録画面 ---
  return (
    <div className="container" style={{ maxWidth: '600px', position: 'relative', zIndex: 1, paddingBottom: '150px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>🎁 商品登録</h2>
        <button onClick={() => setIsAuthenticated(false)} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
          <FaLock /> ロック
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '20px', marginBottom: '40px' }}>
        <form onSubmit={handleSubmit}>
          <label>商品名</label>
          <input name="name" value={formData.name} onChange={handleChange} required placeholder="商品名" />

          {/* 価格入力を復活（サイト非表示の注釈付き） */}
          <label>価格 (円) <span style={{fontSize: '0.8rem', color: '#ccc'}}>※サイトには表示されません</span></label>
          <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="3000" />

          <label>画像URL</label>
          <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} required placeholder="https://..." />

          <label>購入先URL</label>
          <input name="purchaseUrl" value={formData.purchaseUrl} onChange={handleChange} required placeholder="https://..." />

          <label>カテゴリ</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            {['飲食物', '文房具', '日用品', '本', 'エンタメ'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <label>イメージタグ</label>
          <select name="imageTag" value={formData.imageTag} onChange={handleChange}>
            {['癒し', 'ユニーク', '便利', 'おしゃれ', '学び', 'ワクワク'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <label>紹介文 (改行可)</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="5" required placeholder="商品の魅力を入力..." style={{ whiteSpace: 'pre-wrap' }} />

          <button type="submit" className="btn-primary" style={{ width: '100%', borderRadius: '8px', padding: '15px', fontSize: '1.1rem', marginTop: '10px' }}>
            登録する
          </button>
        </form>
        {message && <p className="text-center" style={{ marginTop: '15px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>{message}</p>}
      </div>

      {/* --- 商品一覧 --- */}
      <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '10px' }}>登録済みアイテム ({presents.length})</h3>
      
      {loadingList ? (
        <p>読み込み中...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {presents.map(item => (
            <div key={item.id} className="glass-panel" style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, overflow: 'hidden' }}>
                <img src={item.imageUrl} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                  {/* 管理者には価格が見えるようにしておく */}
                  <div style={{ fontSize: '0.8rem', color: '#ccc' }}>
                    {item.category} | {item.price ? `¥${Number(item.price).toLocaleString()}` : '-'}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(item.id)} 
                style={{ background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', padding: '8px', marginLeft: '10px', cursor: 'pointer' }}
              >
                <FaTrash />
              </button>
            </div>
          ))}
          {presents.length === 0 && <p>まだ登録されていません</p>}
        </div>
      )}
    </div>
  );
};

export default AdminPage;