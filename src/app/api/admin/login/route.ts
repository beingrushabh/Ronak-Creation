import { NextRequest, NextResponse } from 'next/server';

/**
 * Admin login. Accepts JSON body with password. If password matches
 * the ADMIN_PASSWORD environment variable, a session cookie is set.
 */
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!password || password !== adminPassword) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }
    const response = NextResponse.json({ message: 'Logged in' });
    // Set a simple session cookie. In production you should sign and
    // encrypt this value with ADMIN_SESSION_SECRET.
    response.cookies.set('rc_admin_session', 'valid', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    });
    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 });
  }
}