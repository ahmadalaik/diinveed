import { Suspense } from "react";
import { PreviewClient } from "./preview-client";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ templateSlug: string }>;
}) {
  const { templateSlug } = await params;

  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <PreviewClient templateSlug={templateSlug} />
    </Suspense>
  );
}
