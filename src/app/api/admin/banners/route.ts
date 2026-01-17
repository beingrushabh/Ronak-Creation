import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";


const isAuthenticated = () => !!cookies().get("rc_admin_session");

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, image_url, is_active } = body;

    if (!image_url) {
      return NextResponse.json({ message: "image_url is required" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    const supabase = createClient(url, serviceKey);

    // set sort_order to last+1
    const { data: last } = await supabase
      .from("banners")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (last?.sort_order ?? 0) + 1;

    const { data, error } = await supabase
      .from("banners")
      .insert({
        name: name ?? null,
        image_url,
        is_active: typeof is_active === "boolean" ? is_active : true,
        sort_order: nextOrder,
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ banner: data });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Server error" }, { status: 500 });
  }
}