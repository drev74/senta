import type { UiNode } from "@ory/client";
import {
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  isUiNodeTextAttributes,
} from "@ory/integrations/ui";

import { NodeImage, NodeInput, NodeText } from "@/ory";

import type { FormDispatcher, ValueSetter } from "./helpers";
import { NodeAnchor } from "./NodeAnchor";
import { NodeScript } from "./NodeScript";

interface Props {
  node: UiNode;
  disabled: boolean;
  value: any;
  setValue: ValueSetter;
  dispatchSubmit: FormDispatcher;
}

export const Node = ({
  node,
  value,
  setValue,
  disabled,
  dispatchSubmit,
}: Props) => {
  if (isUiNodeImageAttributes(node.attributes)) {
    return <NodeImage node={node} attributes={node.attributes} />;
  }

  if (isUiNodeScriptAttributes(node.attributes)) {
    return <NodeScript node={node} attributes={node.attributes} />;
  }

  if (isUiNodeTextAttributes(node.attributes)) {
    return <NodeText node={node} attributes={node.attributes} />;
  }

  if (isUiNodeAnchorAttributes(node.attributes)) {
    return <NodeAnchor node={node} attributes={node.attributes} />;
  }

  if (isUiNodeInputAttributes(node.attributes)) {
    return (
      <NodeInput
        dispatchSubmit={dispatchSubmit}
        value={value}
        setValue={setValue}
        node={node}
        disabled={disabled}
        attributes={node.attributes}
      />
    );
  }

  return null;
};
