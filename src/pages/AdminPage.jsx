import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { FaLock, FaUnlock } from 'react-icons/fa';

const AdminPage = () => {
  // 管理者パスワード設定 (必要に応じて変更してください)
  const ADMIN_PASSWORD = "xmas2025"; 

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // 登録フォーム用ステート
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

  // パスワード確認処理
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
        price: Number(formData.price),
        createdAt: new Date()
      });
      setMessage('✅ 登録しました！');
      setFormData({ ...formData, name: '', price: '', description: '' }); // 次の入力のために一部リセット
    } catch (error) {
      console.error(error);
      setMessage('❌ エラーが発生しました');
    }
  };

  // --- 認証前のロック画面 ---
  if (!isAuthenticated) {
    return (
      <div className="container flex-center" style={{ height: '60vh', position: 'relative', zIndex: 1 }}>
        <div className="glass-panel" style={{ padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <FaLock size={40} color="var(--accent-gold)" style={{ marginBottom: '20px' }} />
          <h2 style={{ marginTop: 0 }}>管理者アクセス</h2>
          <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>合言葉を入力してください</p>
          
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              value={inputPassword} 
              onChange={(e) => setInputPassword(e.target.value)} 
              placeholder="Password"
              autoFocus
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

  // --- 認証後の登録画面 (以前と同じ) ---
  return (
    <div className="container" style={{ maxWidth: '600px', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>🎁 商品登録 (Admin)</h2>
        <button onClick={() => setIsAuthenticated(false)} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
          <FaLock /> ロックする
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '30px' }}>
        <form onSubmit={handleSubmit}>
          <label>商品名</label>
          <input name="name" value={formData.name} onChange={handleChange} required placeholder="例: クリスマスブレンドコーヒー" />

          <label>価格 (円)</label>
          <input name="price" type="number" value={formData.price} onChange={handleChange} required placeholder="3000" />

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

          <label>紹介文</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required placeholder="商品の魅力を入力..." />

          <button type="submit" className="btn-primary" style={{ width: '100%', borderRadius: '8px' }}>登録する</button>
        </form>
        {message && <p className="text-center" style={{ marginTop: '10px', fontWeight: 'bold' }}>{message}</p>}
      </div>
    </div>
  );
};

export default AdminPage;