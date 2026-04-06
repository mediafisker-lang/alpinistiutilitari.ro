import { NextResponse } from "next/server";
import { z } from "zod";

import { isAdminAuthorizedRequest } from "@/lib/admin-auth";
import { createAdminSupabaseClient, hasAdminSupabaseEnv } from "@/lib/supabase";

const schema = z.object({
  id: z.string().uuid(),
});

function getStoragePathFromUrl(url: string) {
  const marker = "/storage/v1/object/public/issue-images/";
  const markerIndex = url.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(url.slice(markerIndex + marker.length));
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Cerere invalida." }, { status: 400 });
  }

  if (!isAdminAuthorizedRequest(request)) {
    return NextResponse.json({ success: false, message: "Acces admin invalid." }, { status: 401 });
  }

  if (!hasAdminSupabaseEnv()) {
    return NextResponse.json(
      { success: false, message: "Lipseste configurarea Supabase pentru admin." },
      { status: 503 },
    );
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { success: false, message: "Conexiunea la baza de date nu este disponibila." },
      { status: 503 },
    );
  }

  const { data: issue } = await supabase
    .from("issues")
    .select("attachment_urls")
    .eq("id", parsed.data.id)
    .maybeSingle();

  const storagePaths = ((issue?.attachment_urls ?? []) as string[])
    .map((url: string) => getStoragePathFromUrl(url))
    .filter((path): path is string => Boolean(path));

  if (storagePaths.length) {
    await supabase.storage.from("issue-images").remove(storagePaths);
  }

  const { error } = await supabase.from("issues").delete().eq("id", parsed.data.id);

  if (error) {
    return NextResponse.json(
      { success: false, message: "Sesizarea nu a putut fi stearsa." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, message: "Sesizarea a fost stearsa." });
}
