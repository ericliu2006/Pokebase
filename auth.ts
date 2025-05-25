import { authOptions } from './app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';

export { authOptions };

export const getAuthSession = () => getServerSession(authOptions);
