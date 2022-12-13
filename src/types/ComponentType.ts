import { ReactNode } from "react";

export type ChildrenProp<T = ReactNode> = { children: T };
export type ComponentType<T> = (props: T) => JSX.Element;
