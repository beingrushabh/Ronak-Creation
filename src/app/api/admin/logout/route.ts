import { NextResponse } from 'next/server';

/**
 * Clears the admin session cookie.
 */
export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.delete('rc_admin_session');
  return response;
}