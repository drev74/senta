"use client";

import { getNodeLabel } from "@ory/integrations/ui";

import { Button } from "@/components/ui/button";

import type { NodeInputProps } from "./helpers";

export function NodeInputSubmit<T>({
  node,
  attributes,
  disabled,
}: NodeInputProps) {
  return (
    <Button
      name={attributes.name}
      value={attributes.value || ""}
      disabled={attributes.disabled || disabled}
    >
      {getNodeLabel(node)}
    </Button>
  );
}
