export function exportToPDF(review) {
  const content = `
    AI Code Review Report
    ====================
    Date: ${new Date().toLocaleString()}
    Score: ${review.score}/100
    
    Issues Found:
    ${review.issues.map(i => `- ${i.type}: ${i.message}`).join('\n')}
    
    Suggestions:
    ${review.suggestions || 'No suggestions'}
  `;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `code-review-${Date.now()}.txt`;
  a.click();
}

export function shareReview(review) {
  const text = `AI Code Review: Found ${review.issues.length} issues, Score: ${review.score}/100`;
  if (navigator.share) {
    navigator.share({
      title: 'Code Review Results',
      text: text,
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(text);
    alert('Results copied to clipboard!');
  }
}