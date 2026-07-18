// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_INVITATION_STORE_STATE } from "../../../store/invitation-store";
import type { EditorInitialData } from "../../../types/invitation.type";
import { InvitationEditor } from "../invitation-editor";

vi.mock("../editor", () => ({
  Editor: () => <div>Editor ready</div>,
}));

vi.mock("../../preview/preview", () => ({
  Preview: () => <div>Preview ready</div>,
}));

vi.mock("../../../actions/save-invitation", () => ({
  saveInvitation: vi.fn(),
}));

function createInitialData(): EditorInitialData {
  return {
    ...DEFAULT_INVITATION_STORE_STATE,
    title: "Editor Regression",
    liveSlug: "editor-regression",
    hasUnpublishedChanges: false,
    updatedAt: new Date("2026-07-17T00:00:00.000Z"),
  };
}

describe("InvitationEditor", () => {
  it("mounts its invitation store provider before using store hooks", () => {
    render(<InvitationEditor initialData={createInitialData()} />);

    expect(screen.getByText("Editor ready")).toBeTruthy();
    expect(screen.getByText("Preview ready")).toBeTruthy();
  });
});
