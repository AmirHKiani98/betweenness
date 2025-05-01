import { motion } from "motion/react";
import {computePosition, Placement} from "@floating-ui/reacts-dom";

import {
  useFloating,
  offset,
  useHover,
  useInteractions,
  FloatingPortal,
  autoUpdate,
  
} from "@floating-ui/react";
import { ReactElement, useState, cloneElement } from "react";
interface TooltipWrapperProps {
    tooltipText: string;
    tooltipPosition: Placement;
    children: ReactElement;
  }
export function TooltipWrapper({ tooltipText, tooltipPosition = "top", children }: TooltipWrapperProps) {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  
    const {
      refs,
      floatingStyles,
      context,
    } = useFloating({
      open: isTooltipOpen,
      onOpenChange: setIsTooltipOpen,
      middleware: [offset(8)],
      whileElementsMounted: autoUpdate,
      placement: tooltipPosition,
    });
  
    const hover = useHover(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([hover]);
  
    // Clone the child to attach ref + props
    const wrappedChild = cloneElement(children, {
      ref: refs.setReference,
      ...getReferenceProps(),
    });
  
    return (
      <>
        {wrappedChild}
        {isTooltipOpen && (
          <FloatingPortal>
            <div
              ref={refs.setFloating}
              {...getFloatingProps()}
              style={{
                ...floatingStyles,
                position: "absolute",
                zIndex: 1000,
              }}
              className="bg-gray-700 text-white text-sm px-2 py-1 rounded shadow"
            >
              {tooltipText}
            </div>
          </FloatingPortal>
        )}
      </>
    );
  }