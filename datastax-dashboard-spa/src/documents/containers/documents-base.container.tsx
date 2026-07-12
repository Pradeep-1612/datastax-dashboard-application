import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../StoreConfiguration";
import { documentsActions } from "../store/reducer";
import "./documents-base.container.css";
import HomeContainer from "./home.container";

function DocumentsBaseContainer() {
  const dispatch = useDispatch<AppDispatch>();

  // Reset documents store when component mounts
  useEffect(() => {
    dispatch(documentsActions.resetDocumentsStore());
  }, [dispatch]);

  return (
    <div className="documents-base">
      <HomeContainer />
    </div>
  );
}

export default DocumentsBaseContainer;
