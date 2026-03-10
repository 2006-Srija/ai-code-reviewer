import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  console.log('🔍 DEBUG - Session user:', session.user);
  
  res.status(200).json({
    userId: session.user.id,
    name: session.user.name,
    email: session.user.email
  });
}