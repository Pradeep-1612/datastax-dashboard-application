import { Header, HeaderName, SkipToContent } from "@carbon/react";
import "./header.container.css";
import dbIcon from "../../assets/db.svg";

function HeaderContainer() {
  return (
    <>
      <Header className="header">
        <SkipToContent />
        <HeaderName prefix="">
          <div className="header-label">
          <img src={dbIcon} />
          <div className="title">Data on the house <p className="caption">(Datastax dashboard)</p></div>
          </div>
        </HeaderName>
      </Header>
    </>
  );
}
export default HeaderContainer;
