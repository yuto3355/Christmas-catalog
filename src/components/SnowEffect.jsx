import React from 'react';

const SnowEffect = () => {
  // 雪の結晶を生成（パフォーマンスのため数を調整）
  const snowflakes = Array.from({ length: 50 });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden'
    }}>
      {snowflakes.map((_, i) => {
        const left = Math.random() * 100;
        const animationDuration = 5 + Math.random() * 10;
        const size = Math.random() * 10 + 5;
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '-20px',
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: 'white',
              borderRadius: '50%',
              opacity: Math.random() * 0.8,
              filter: 'blur(1px)',
              animation: `fall ${animationDuration}s linear infinite`,
              animationDelay: `-${Math.random() * 10}s`
            }}
          />
        );
      })}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) translateX(0); }
          100% { transform: translateY(100vh) translateX(20px); }
        }
      `}</style>
    </div>
  );
};

export default SnowEffect;