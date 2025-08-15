import { createServerClient } from "@/utils/supabase/server"

export async function GET() {
  const supabase = createServerClient()
  const { data, error } = await supabase.from("shifts").select("*")

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ data })
}
