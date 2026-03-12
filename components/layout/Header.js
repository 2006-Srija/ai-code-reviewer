import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import ThemeToggle from '../ThemeToggle';

export default function Header() {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.body.style.background = !isDark ? '#0f172a' : '#ffffff';
    document.body.style.color = !isDark ? '#f8fafc' : '#1e293b';
  };

  return (
    <>
      {/* Main Header */}
      <header className="header">
        <div className="header-content">
          <button 
            onClick={() => setSidebarOpen(true)}
            style={menuButtonStyle}
          >
            ☰
          </button>

          <Link href="/" className="logo">
            🤖 AI Reviewer
          </Link>

          {status === 'authenticated' ? (
            <div style={{ position: 'relative' }}>
              <img 
                src={session.user.image} 
                alt="avatar" 
                style={avatarStyle}
                onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
              />

              {avatarMenuOpen && (
                <>
                  <div style={overlayStyle} onClick={() => setAvatarMenuOpen(false)} />
                  <div style={dropdownStyle}>
                    <div style={userInfoStyle}>
                      <p style={{ fontWeight: '600' }}>{session.user.name}</p>
                      <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{session.user.email}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setAvatarMenuOpen(false)} style={dropdownItemStyle}>
                      📊 Dashboard
                    </Link>
                    <Link href="/settings" onClick={() => setAvatarMenuOpen(false)} style={dropdownItemStyle}>
                      ⚙️ Settings
                    </Link>
                    <button onClick={() => { signOut({ callbackUrl: '/' }); setAvatarMenuOpen(false); }} style={dropdownSignOutStyle}>
                      🚪 Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button onClick={() => signIn('github')} className="btn" style={{ padding: '8px 16px' }}>
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Sidebar */}
      {sidebarOpen && (
        <>
          <div style={overlayStyle} onClick={() => setSidebarOpen(false)} />
          <div style={sidebarStyle}>
            <button onClick={() => setSidebarOpen(false)} style={closeButtonStyle}>✕</button>

            {status === 'authenticated' && (
              <div style={sidebarUserStyle}>
                <img src={session.user.image} alt="avatar" style={sidebarAvatarStyle} />
                <p style={{ fontWeight: '600' }}>{session.user.name}</p>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{session.user.email}</p>
              </div>
            )}

            <nav style={navStyle}>
              <SidebarLink href="/" icon="🏠" text="Home" onClick={() => setSidebarOpen(false)} />
              <SidebarLink href="/dashboard" icon="📊" text="Dashboard" onClick={() => setSidebarOpen(false)} />
              <SidebarLink href="/docs" icon="📚" text="Documentation" onClick={() => setSidebarOpen(false)} />
              <SidebarLink href="/pricing" icon="💰" text="Pricing" onClick={() => setSidebarOpen(false)} />
              <SidebarLink href="/demo" icon="🎮" text="Live Demo" onClick={() => setSidebarOpen(false)} />
              <SidebarLink href="/faq" icon="❓" text="FAQ" onClick={() => setSidebarOpen(false)} />
              <SidebarLink href="/contact" icon="📧" text="Contact" onClick={() => setSidebarOpen(false)} />
            </nav>

            <div style={bottomActionsStyle}>
              <ThemeToggle isDark={isDark} onToggle={toggleDarkMode} />
              {status === 'authenticated' && (
                <button onClick={() => { signOut({ callbackUrl: '/' }); setSidebarOpen(false); }} style={sidebarSignOutStyle}>
                  🚪 Sign Out
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

// Styles
const menuButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.5rem',
  color: '#1e293b'
};

const avatarStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  border: '2px solid #2563eb',
  cursor: 'pointer',
  transition: 'transform 0.2s ease'
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.5)',
  zIndex: 98
};

const dropdownStyle = {
  position: 'absolute',
  top: '50px',
  right: 0,
  width: '240px',
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
  border: '1px solid #f1f5f9',
  zIndex: 99,
  overflow: 'hidden'
};

const userInfoStyle = {
  padding: '1rem',
  borderBottom: '1px solid #f1f5f9'
};

const dropdownItemStyle = {
  display: 'block',
  padding: '0.75rem 1rem',
  color: '#1e293b',
  textDecoration: 'none',
  transition: 'background 0.2s ease'
};

const dropdownSignOutStyle = {
  ...dropdownItemStyle,
  color: '#dc2626',
  width: '100%',
  textAlign: 'left',
  border: 'none',
  background: 'none',
  cursor: 'pointer'
};

const sidebarStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  width: '300px',
  background: 'white',
  zIndex: 100,
  padding: '2rem 1.5rem',
  boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
  animation: 'slideIn 0.3s ease',
  display: 'flex',
  flexDirection: 'column'
};

const closeButtonStyle = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  color: '#64748b'
};

const sidebarUserStyle = {
  marginBottom: '2rem',
  paddingBottom: '1.5rem',
  borderBottom: '1px solid #f1f5f9'
};

const sidebarAvatarStyle = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  marginBottom: '0.75rem'
};

const navStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const bottomActionsStyle = {
  borderTop: '1px solid #f1f5f9',
  paddingTop: '1.5rem',
  marginTop: '1.5rem'
};

const sidebarSignOutStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  padding: '0.75rem 1rem',
  background: 'none',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontSize: '1rem',
  color: '#dc2626',
  marginTop: '0.5rem'
};

function SidebarLink({ href, icon, text, onClick }) {
  return (
    <Link href={href} onClick={onClick} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      color: '#1e293b',
      textDecoration: 'none',
      transition: 'background 0.2s ease'
    }}>
      <span style={{ fontSize: '1.25rem', width: '24px' }}>{icon}</span>
      <span style={{ fontWeight: '500' }}>{text}</span>
    </Link>
  );
}