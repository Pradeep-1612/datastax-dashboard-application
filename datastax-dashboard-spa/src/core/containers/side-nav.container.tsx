import { SideNav, SideNavItems, SideNavLink } from "@carbon/react";
import { useLocation, useNavigate } from "react-router-dom";

function SideNavContainer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <>
      <SideNav
        isFixedNav
        expanded={true}
        isChildOfHeader={false}
        aria-label="Side navigation"
      >
        <SideNavItems>
          <SideNavLink
            href="/configurations"
            isActive={location.pathname === "/configurations"}
            onClick={handleNavigation("/configurations")}
          >
            Configurations
          </SideNavLink>
          <SideNavLink
            href="/documents"
            isActive={location.pathname === "/documents"}
            onClick={handleNavigation("/documents")}
          >
            Documents
          </SideNavLink>
          <SideNavLink
            href="/manage-data"
            isActive={location.pathname === "/manage-data"}
            onClick={handleNavigation("/manage-data")}
          >
            Manage data
          </SideNavLink>
          <SideNavLink
            href="/indexes"
            isActive={location.pathname === "/indexes"}
            onClick={handleNavigation("/indexes")}
          >
            Indexes
          </SideNavLink>
        </SideNavItems>
      </SideNav>
    </>
  );
}
export default SideNavContainer;
