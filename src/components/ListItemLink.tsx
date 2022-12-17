import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { ComponentProps } from "react";
import { Link } from "react-router-dom";
import { ChildrenProp, ComponentType } from "../types/ComponentType";

export const ListItemLink: ComponentType<
  {
    icon?: React.ReactElement;
    to: string;
  } & ChildrenProp<string> &
    Pick<ComponentProps<typeof ListItem>, "disablePadding">
> = ({ icon, to, children, ...props }) => (
  <ListItem button component={Link} to={to} {...props}>
    {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
    <ListItemText primary={children} />
  </ListItem>
);
