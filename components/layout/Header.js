import Link from 'next/link';

export default function Header() {
  return (
    <header style={{
      background: '#24292e',
      color: 'white',
      padding: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link href="/" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
        🤖 AI Code Reviewer
      </Link>
      
      <nav>
        <Link href="/dashboard" style={{ color: 'white', margin: '0 15px' }}>
          Dashboard
        </Link>
        <Link href="/docs" style={{ color: 'white', margin: '0 15px' }}>
          Docs
        </Link>
        <Link href="/pricing" style={{ color: 'white', margin: '0 15px' }}>
          Pricing
        </Link>
      </nav>
    </header>
  );
}