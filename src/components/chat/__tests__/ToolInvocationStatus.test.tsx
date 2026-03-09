import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationStatus } from "../ToolInvocationStatus";

afterEach(() => {
  cleanup();
});

// str_replace_editor tests

test("shows 'Creating' for str_replace_editor create command", () => {
  render(
    <ToolInvocationStatus
      tool={{
        toolName: "str_replace_editor",
        state: "call",
        args: { command: "create", path: "/src/components/Button.tsx" },
      }}
    />
  );
  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
});

test("shows 'Editing' for str_replace_editor str_replace command", () => {
  render(
    <ToolInvocationStatus
      tool={{
        toolName: "str_replace_editor",
        state: "call",
        args: { command: "str_replace", path: "/src/App.jsx" },
      }}
    />
  );
  expect(screen.getByText("Editing App.jsx")).toBeDefined();
});

test("shows 'Editing' for str_replace_editor insert command", () => {
  render(
    <ToolInvocationStatus
      tool={{
        toolName: "str_replace_editor",
        state: "call",
        args: { command: "insert", path: "/src/App.jsx" },
      }}
    />
  );
  expect(screen.getByText("Editing App.jsx")).toBeDefined();
});

test("shows 'Reading' for str_replace_editor view command", () => {
  render(
    <ToolInvocationStatus
      tool={{
        toolName: "str_replace_editor",
        state: "call",
        args: { command: "view", path: "/src/utils.ts" },
      }}
    />
  );
  expect(screen.getByText("Reading utils.ts")).toBeDefined();
});

// file_manager tests

test("shows 'Renaming' with both filenames for file_manager rename command", () => {
  render(
    <ToolInvocationStatus
      tool={{
        toolName: "file_manager",
        state: "call",
        args: { command: "rename", path: "/src/Old.tsx", new_path: "/src/New.tsx" },
      }}
    />
  );
  expect(screen.getByText("Renaming Old.tsx to New.tsx")).toBeDefined();
});

test("shows 'Deleting' for file_manager delete command", () => {
  render(
    <ToolInvocationStatus
      tool={{
        toolName: "file_manager",
        state: "call",
        args: { command: "delete", path: "/src/Unused.tsx" },
      }}
    />
  );
  expect(screen.getByText("Deleting Unused.tsx")).toBeDefined();
});

// State tests

test("shows spinner when tool is in progress", () => {
  const { container } = render(
    <ToolInvocationStatus
      tool={{
        toolName: "str_replace_editor",
        state: "call",
        args: { command: "create", path: "/App.jsx" },
      }}
    />
  );
  expect(container.querySelector(".animate-spin")).toBeTruthy();
});

test("shows green dot when tool has a result", () => {
  const { container } = render(
    <ToolInvocationStatus
      tool={{
        toolName: "str_replace_editor",
        state: "result",
        result: "ok",
        args: { command: "create", path: "/App.jsx" },
      }}
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeTruthy();
  expect(container.querySelector(".animate-spin")).toBeFalsy();
});
