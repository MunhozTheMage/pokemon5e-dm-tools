import { NavigateFunction, useNavigate } from "react-router-dom";

type NavigateRenderFn = (navigate: NavigateFunction) => JSX.Element;

export const Navigate = ({ children }: { children: NavigateRenderFn }) => {
  const navigate = useNavigate();
  return <>{children(navigate)}</>;
};
