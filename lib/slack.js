const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export async function sendSlackNotification(prUrl, score, issues, repo) {
  if (!SLACK_WEBHOOK_URL) return;

  const color = score >= 80 ? '#2ea44f' : score >= 60 ? '#f9c513' : '#cb2431';
  
  const message = {
    attachments: [{
      color: color,
      title: `🔍 Athena Review: ${repo}`,
      title_link: prUrl,
      fields: [
        { title: "Quality Score", value: `${score}/100`, short: true },
        { title: "Issues Found", value: `${issues}`, short: true },
        { title: "Status", value: score >= 80 ? "✅ Passed" : "⚠️ Needs Review", short: true }
      ],
      footer: "Athena AI Code Review",
      ts: Math.floor(Date.now() / 1000)
    }]
  };

  try {
    await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
    console.log('✅ Slack notification sent');
  } catch (error) {
    console.error('Slack error:', error);
  }
}