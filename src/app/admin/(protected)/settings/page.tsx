import { createClient } from '@supabase/supabase-js';

async function getSettings() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const supabase = createClient(supabaseUrl, serviceKey);
  const { data, error } = await supabase.from('settings').select('*').limit(1).single();
  if (error) throw new Error(error.message);
  return data;
}

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <form action="/api/admin/settings" method="post" className="space-y-4">
        <div className="space-y-2 max-w-xs">
          <label htmlFor="active_banner_count" className="block text-sm font-medium">Number of active banners</label>
          <input
            type="number"
            id="active_banner_count"
            name="active_banner_count"
            defaultValue={settings.active_banner_count ?? 3}
            min={1}
            max={10}
            className="border rounded p-2 text-sm w-full"
          />
        </div>
        <button type="submit" className="bg-primary text-white px-3 py-2 rounded text-sm">Save</button>
      </form>
    </div>
  );
}