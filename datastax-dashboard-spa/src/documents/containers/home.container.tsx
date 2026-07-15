import { Button, Callout, Link, Search, TextInput } from "@carbon/react";
import "./home.container.css";
import { fetchDocuments } from "../store/effects";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../StoreConfiguration";
import DocumentTableContainer from "./document-table.container";
import { useState } from "react";
import AddDocumentComponent from "../components/add-document.component";
import { documentsActions } from "../store/reducer";
import { useNavigate } from "react-router-dom";

function HomeContainer() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchValue, setSearchValue] = useState("");
  const [quickLookupValue, setQuickLookupValue] = useState("");
  const navigate = useNavigate();
  const isConfigured = !!sessionStorage.getItem('config_url');

  function onSearch(event: any) {
    const value = event.target.value;
    const previousValue = searchValue;
    setSearchValue(value);

    // If quick lookup is being cleared (had value, now empty)
    if (previousValue && !value) {
      // Trigger search with remaining search value after state updates
      setTimeout(() => {
        handleGoClickWithValues("", quickLookupValue);
      }, 0);
    }
  }

  function onQuickLookup(event: any) {
    const value = event.target.value;
    const previousValue = quickLookupValue;
    setQuickLookupValue(value);

    // If quick lookup is being cleared (had value, now empty)
    if (previousValue && !value) {
      // Trigger search with remaining search value after state updates
      setTimeout(() => {
        handleGoClickWithValues(searchValue, "");
      }, 0);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      handleGoClick();
    }
  }

  function handleClearSearch() {
    setSearchValue("");
    // After clearing, trigger search with remaining quick lookup value
    setTimeout(() => {
      handleGoClickWithValues("", quickLookupValue);
    }, 0);
  }

  function handleGoClickWithValues(searchVal: string, quickLookupVal: string) {
    const queryValue: any = {};
    if (searchVal) {
      queryValue._id = searchVal;
    }
    if (quickLookupVal) {
      const quickLookupItems = quickLookupVal.split("=");
      if (quickLookupItems.length !== 2) {
        return;
      }
      const key = quickLookupItems[0].trim();
      let value = quickLookupItems[1].trim();
      // Remove surrounding quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      queryValue[key] = value;
    }

    // If both are empty, set searchQuery to undefined
    if (Object.keys(queryValue).length === 0) {
      dispatch(documentsActions.setSearchQuery(undefined));
      return;
    }
    dispatch(documentsActions.resetPageStates());
    dispatch(fetchDocuments(queryValue));
  }

  function handleGoClick() {
    handleGoClickWithValues(searchValue, quickLookupValue);
  }

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <>
      <div className="header-div">
        <header>Documents</header>
        <Button
          className="add-button"
          size="md"
          kind="tertiary"
          onClick={() => dispatch(documentsActions.addDocumentRequested())}
          disabled={!isConfigured}
        >
          Add document
        </Button>
      </div>
      {!isConfigured && (
        <Callout
          title="Action required"
          titleId="my fancy id 123"
          kind="warning"
          lowContrast
        >
          <div className="cds--inline-notification__subtitle">
            No database endpoint has been configured. {" "}
            <Link onClick={handleNavigation("/configurations")}>
               Configure now.
            </Link>
          </div>
        </Callout>
      )}
      <div className="action-layout">
        <Search
          className="search-bar"
          labelText="Site search"
          placeholder="Search by document ID"
          size="md"
          type="search"
          onChange={onSearch}
          onKeyDown={handleKeyDown}
          onClear={handleClearSearch}
          value={searchValue}
          disabled={!isConfigured}
        />
        <TextInput
          id="quick-lookup"
          labelText="Quick lookup"
          placeholder='_collection="ssuser"'
          size="md"
          onChange={onQuickLookup}
          onKeyDown={handleKeyDown}
          value={quickLookupValue}
          disabled={!isConfigured}
        />
        <Button className="add-button" size="md" onClick={handleGoClick} disabled={!isConfigured}>
          Go
        </Button>
      </div>
      <br />
      <br />
      <DocumentTableContainer />
      <AddDocumentComponent />
    </>
  );
}

export default HomeContainer;
