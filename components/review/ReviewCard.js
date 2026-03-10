export default function ReviewCard({ review }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'passed': return '#2ea44f';
      case 'warning': return '#f9c513';
      case 'failed': return '#cb2431';
      default: return '#6a737d';
    }
  };

  return (
    <div style={{
      border: '1px solid #e1e4e8',
      borderRadius: '8px',
      padding: '16px',
      margin: '10px 0',
      background: 'white'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>{review?.repo || 'repo/name'}#{review?.pr || '123'}</h3>
        <span style={{
          background: getStatusColor(review?.status || 'pending'),
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          {review?.status || 'pending'}
        </span>
      </div>
      
      <p>Score: {review?.score || 85}/100</p>
      <p>Issues: {review?.issues?.length || 3}</p>
      
      <button style={{
        background: '#0366d6',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        View Details
      </button>
    </div>
  );
}