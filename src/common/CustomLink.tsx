import { Link } from "react-router-dom";

export const CustomLink = ({ to, children }: { to: string; children: any }) => {
  return (
    <Link to={to} state={location.pathname}>
      {children}
    </Link>
  );
};
