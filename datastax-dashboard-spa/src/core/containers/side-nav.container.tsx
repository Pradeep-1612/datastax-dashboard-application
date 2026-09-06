import { SideNav, SideNavItems, SideNavLink } from "@carbon/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSharedLinkParams } from "../../utilities/use-shared-link-params";
import AppVersionComponent from "../components/app-version.component";

function SideNavContainer() {
  const location = useLocation();
  const navigate = useNavigate();

  // Re-reads sessionStorage on mount; produces "?environment=…&state=…" or ""
  // when config is incomplete (no environment or headerValue saved yet).
  const sharedLinkParams = useSharedLinkParams();

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(sharedLinkParams ? `${path}${sharedLinkParams}` : path);
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
            href="/query-editor"
            isActive={location.pathname === "/query-editor"}
            onClick={handleNavigation("/query-editor")}
          >
            Query editor
          </SideNavLink>
          <SideNavLink
            href="/indexes"
            isActive={location.pathname === "/indexes"}
            onClick={handleNavigation("/indexes")}
          >
            Indexes
          </SideNavLink>
        </SideNavItems>
        <AppVersionComponent />
      </SideNav>
    </>
  );
}

export default SideNavContainer;
