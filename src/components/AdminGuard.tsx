import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * AdminGuard checks for the presence of a session cookie set after admin
 * authentication. If no session is found, the user is redirected to the
 * login page. Use this wrapper in admin route layouts.
 */
export default function AdminGuard({ children }: { children: ReactNode }) {
  const cookie = cookies().get('rc_admin_session');
  if (!cookie) {
    // Redirect unauthenticated users to login
    redirect('/admin/login');
  }
  return <>{children}</>;
}