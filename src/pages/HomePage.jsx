import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 背景画像のURL (お好みで差し替えてください)
  const BG_IMAGE_URL = "https://cdn.pixabay.com/photo/2015/12/07/20/07/the-christmas-tree-1081321_1280.jpg";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError('認証に失敗しました: ' + err.message);
    }
  };

  const handleLogout = () => signOut(auth);

  return (
    <>
      {/* 背景画像エリア (雪より後ろ) */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${BG_IMAGE_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: -1, // 一番後ろ
        filter: 'brightness(0.6)' // 文字を読みやすくするため少し暗くする
      }} />

      <div className="container text-center" style={{ paddingTop: '50px' }}>
        {/* ヒーローセクション */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 style={{ fontSize: '3rem', margin: '20px 0', textShadow: '0 0 10px gold' }}>
            🎄 Merry Christmas !! 🎁
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '40px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            あなただけのお気に入りプレゼントを見つけよう
          </p>
          
          <Link to="/catalog" className="btn-primary" style={{ fontSize: '1.5rem', padding: '15px 40px', marginBottom: '60px' }}>
            カタログを見る
          </Link>
        </motion.div>

        {/* 認証セクション */}
        <div className="flex-center">
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '20px', background: 'rgba(255,255,255,0.9)', color: '#333' }}>
            {user ? (
              <div>
                <h3>ようこそ、{user.email} さん！</h3>
                <p>素敵なクリスマスを。</p>
                <button onClick={handleLogout} className="btn-secondary">ログアウト</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
                  <button 
                    onClick={() => setIsLoginView(true)}
                    style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderBottom: isLoginView ? '3px solid var(--accent-red)' : 'none', fontWeight: 'bold', cursor: 'pointer', color: isLoginView ? 'var(--accent-red)' : '#888' }}
                  >
                    ログイン
                  </button>
                  <button 
                    onClick={() => setIsLoginView(false)}
                    style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderBottom: !isLoginView ? '3px solid var(--accent-red)' : 'none', fontWeight: 'bold', cursor: 'pointer', color: !isLoginView ? 'var(--accent-red)' : '#888' }}
                  >
                    新規登録
                  </button>
                </div>

                <form onSubmit={handleAuth}>
                  <input 
                    type="email" 
                    placeholder="メールアドレス" 
                    value={email} onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={{ background: 'white', color: 'black', border: '1px solid #ccc' }}
                  />
                  <input 
                    type="password" 
                    placeholder="パスワード" 
                    value={password} onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ background: 'white', color: 'black', border: '1px solid #ccc' }}
                  />
                  {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
                  <button type="submit" className="btn-primary" style={{ width: '100%', borderRadius: '8px' }}>
                    {isLoginView ? 'ログイン' : '登録して始める'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;