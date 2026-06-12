// @vitest-environment jsdom
import { StrictMode } from "react";
import { render, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { useInvitationStore } from "../../store/invitation-store";
import { usePreviewState } from "../use-preview-state";
import { useHydrateInvitationStore } from "../use-hydrate-invitation-store";
import type {
  EditorInitialData,
  InvitationState,
} from "../../types/invitation.type";

const EMPTY: Pick<InvitationState, "title" | "brideName" | "groomName"> = {
  title: "",
  brideName: "",
  groomName: "",
};

const INITIAL_DATA = {
  title: "Real Title",
  brideName: "Alice",
  groomName: "Bob",
  liveSlug: "",
  hasUnpublishedChanges: false,
} as unknown as EditorInitialData;

// Child that reads the preview snapshot and reports it back, mirroring how
// <Preview/> consumes usePreviewState as a child of <InvitationEditor/>.
function PreviewProbe({
  report,
}: {
  report: (snap: InvitationState) => void;
}) {
  const snapshot = usePreviewState(200);
  report(snapshot);
  return null;
}

// Parent hydrates the store, child reads the snapshot — same ordering as the
// real editor tree.
function Harness({
  initialData,
  report,
}: {
  initialData: EditorInitialData;
  report: (snap: InvitationState) => void;
}) {
  useHydrateInvitationStore(initialData);
  return <PreviewProbe report={report} />;
}

beforeEach(() => {
  useInvitationStore.setState({ ...EMPTY });
});

afterEach(() => {
  cleanup();
  useInvitationStore.setState({ ...EMPTY });
});

describe("useHydrateInvitationStore", () => {
  it("makes preview snapshot reflect hydrated data on first render under StrictMode", () => {
    let latest: InvitationState | null = null;
    const report = (snap: InvitationState) => {
      latest = snap;
    };

    render(
      <StrictMode>
        <Harness initialData={INITIAL_DATA} report={report} />
      </StrictMode>,
    );

    expect(latest).not.toBeNull();
    expect(latest!.title).toBe("Real Title");
    expect(latest!.brideName).toBe("Alice");
    expect(latest!.groomName).toBe("Bob");
  });
});
