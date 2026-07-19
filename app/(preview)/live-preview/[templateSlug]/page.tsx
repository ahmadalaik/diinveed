import { LivePreviewClient } from "./live-preview-client";

export default async function LivePreviewPage({
  params,
}: {
  params: Promise<{ templateSlug: string }>;
}) {
  const { templateSlug } = await params;

  return <LivePreviewClient templateSlug={templateSlug} />;
}
