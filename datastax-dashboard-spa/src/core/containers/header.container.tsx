import { Header, HeaderName, SkipToContent } from "@carbon/react";
import "./header.container.css";
import dbIcon from "../../assets/db.svg";

function HeaderContainer() {
  const collection = sessionStorage.getItem("config_collection");

  return (
    <>
      <Header className="header">
        <SkipToContent />
        <HeaderName prefix="">
          <div className="header-label">
            <img src={dbIcon} />
            <div className="title">
              Data on the house <p className="caption">(Datastax dashboard)</p>
            </div>
          </div>
        </HeaderName>
        {collection && (
          <span className="header-collection-tag">
            <span className="header-collection-label">Collection</span>
            <span className="header-collection-value">{collection}</span>
          </span>
        )}
      </Header>
    </>
  );
}
export default HeaderContainer;
