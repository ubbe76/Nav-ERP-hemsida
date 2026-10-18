import { buildManualIndex } from "@/lib/manual-index";

export const dynamic = "force-static";

export function GET() {
  return Response.json(buildManualIndex());
}
