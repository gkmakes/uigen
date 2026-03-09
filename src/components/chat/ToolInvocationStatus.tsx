"use client";

import { Loader2 } from "lucide-react";

interface StrReplaceArgs {
  command: "view" | "create" | "str_replace" | "insert" | "undo_edit";
  path: string;
  new_str?: string;
  old_str?: string;
  file_text?: string;
}

interface FileManagerArgs {
  command: "rename" | "delete";
  path: string;
  new_path?: string;
}

interface ToolInvocation {
  toolName: string;
  state: "call" | "partial-call" | "result";
  result?: unknown;
  args: StrReplaceArgs | FileManagerArgs | Record<string, unknown>;
}

interface ToolInvocationStatusProps {
  tool: ToolInvocation;
}

function getLabel(tool: ToolInvocation): string {
  const args = tool.args as Record<string, string>;
  const path = args.path ?? "";
  const filename = path.split("/").filter(Boolean).pop() ?? path;

  if (tool.toolName === "str_replace_editor") {
    switch ((args as StrReplaceArgs).command) {
      case "create":
        return `Creating ${filename}`;
      case "str_replace":
      case "insert":
        return `Editing ${filename}`;
      case "view":
        return `Reading ${filename}`;
      default:
        return `Updating ${filename}`;
    }
  }

  if (tool.toolName === "file_manager") {
    const { command, new_path } = args as FileManagerArgs;
    if (command === "rename" && new_path) {
      const newFilename = new_path.split("/").filter(Boolean).pop() ?? new_path;
      return `Renaming ${filename} to ${newFilename}`;
    }
    if (command === "delete") {
      return `Deleting ${filename}`;
    }
  }

  return path ? `Working on ${filename}` : "Working…";
}

export function ToolInvocationStatus({ tool }: ToolInvocationStatusProps) {
  const done = tool.state === "result" && tool.result != null;
  const label = getLabel(tool);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {done ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
