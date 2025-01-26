"use client";

import { AlertTriangle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { NodeInputProps } from "./helpers";

export function NodeInputDefault<T>(props: NodeInputProps) {
  const { node, attributes, value = "", setValue, disabled } = props;

  // Some attributes have dynamic JavaScript - this is for example required for WebAuthn.
  const onClick = () => {
    // This section is only used for WebAuthn. The script is loaded via a <script> node
    // and the functions are available on the global window level. Unfortunately, there
    // is currently no better way than executing eval / function here at this moment.
    if (attributes.onclick) {
      const run = new Function(attributes.onclick);
      run();
    }
  };

  const state = node.messages.find(({ type }) => type === "error")
    ? "error"
    : undefined;

  // Render a generic text input field.
  return (
    <div>
      <Label className={state ? "text-yellow-500" : undefined}>
        {node.meta.label?.text}
      </Label>
      <Input
        title={node.meta.label?.text}
        onClick={onClick}
        onChange={(e) => setValue(e.target.value)}
        placeholder={node.meta.label?.text}
        type={attributes.type}
        name={attributes.name}
        value={value}
        autoComplete={attributes.autocomplete}
        disabled={attributes.disabled || disabled}
      />
      {node.messages.map(({ text, id }, k) => (
        <Label
          className="mt-1.5 inline-flex items-center space-x-2 text-yellow-500"
          key={`${id}-${k}`}
        >
          <AlertTriangle className="size-4" />
          <span>{text}</span>
        </Label>
      ))}
    </div>
  );
}
