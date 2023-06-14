import type { ElementType, ReactNode } from "react";
import React, { forwardRef } from "react";
import type {
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithRef,
  PolymorphicPropsWithoutRef,
} from "react-polymorphic-types";

import clsx, { ClassValue } from "clsx";

export interface BoxComponentProps {
  className?: ClassValue;
  children?: ReactNode;
  id?: string;
}

export const DefaultBoxElement = "div";

export type BoxProps<E extends ElementType = ElementType> =
  PolymorphicPropsWithRef<BoxComponentProps, E>;

export function MainBox<E extends ElementType = typeof DefaultBoxElement>(
  {
    as,
    className,
    id,
    ...props
  }: PolymorphicPropsWithoutRef<BoxComponentProps, E>,
  ref: React.ForwardedRef<E>
) {
  const Element: ElementType = as || DefaultBoxElement;

  return (
    <Element
      ref={ref}
      id={id}
      className={clsx(`tb-box`, className)}
      {...props}
    />
  );
}

export const Box: PolymorphicForwardRefExoticComponent<
  BoxComponentProps,
  typeof DefaultBoxElement
> = forwardRef(MainBox);
