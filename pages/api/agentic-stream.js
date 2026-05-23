export default async function handler(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const { code } = req.body;

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  sendEvent('start', { message: 'Starting agentic review...' });

  // Run agents sequentially with progress updates
  const agents = ['security', 'performance', 'quality', 'architecture'];
  
  for (const agent of agents) {
    sendEvent('progress', { agent, status: 'running' });
    const result = await callAgent(agent, code);
    sendEvent('result', { agent, findings: result });
  }

  sendEvent('complete', { message: 'Review complete!' });
  res.end();
}