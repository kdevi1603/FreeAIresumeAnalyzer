import React from 'react';

export default function BeforeAfterGraphic() {
  return (
    <div className="before-after-container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      width: '100%', 
      height: '100%', 
      padding: '20px' 
    }}>
      <img 
        src="/hero-image.png" 
        alt="AI Resume Builder Modern Graphic" 
        style={{
          maxWidth: '100%',
          maxHeight: '600px',
          objectFit: 'contain',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-color)',
          animation: 'fadeIn 0.5s ease-out'
        }}
      />
    </div>
  );
}
