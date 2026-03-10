function Error({ statusCode }) {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center',
      fontFamily: 'Arial',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '72px', marginBottom: '20px', color: '#cb2431' }}>
        {statusCode || 'Error'}
      </h1>
      <h2 style={{ marginBottom: '30px' }}>
        {statusCode === 404 ? 'Page Not Found' : 'Something went wrong'}
      </h2>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        {statusCode === 404 
          ? 'The page you\'re looking for doesn\'t exist.'
          : 'An unexpected error occurred. Please try again.'}
      </p>
      <a 
        href="/" 
        style={{
          background: '#0366d6',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '6px',
          textDecoration: 'none',
          display: 'inline-block'
        }}
      >
        ← Go Back Home
      </a>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;