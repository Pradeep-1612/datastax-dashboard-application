import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Editor } from "@monaco-editor/react";
import { defaultEditorOptions, MONACO_THEME } from "../../utilities/monaco-theme";
import { indexesEffects } from "../store/effects";
import { selectFetchingIndexes, selectIndexes } from "../store/reducer";
import type { AppDispatch } from "../../StoreConfiguration";
import AILoadingComponent from "../../core/components/ai-loading.component";

const IndexesViewComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isFetching = useSelector(selectFetchingIndexes);
  const indexes = useSelector(selectIndexes);

  useEffect(() => {
    dispatch(indexesEffects.getIndexes());
  }, [dispatch]);

  const editorValue = JSON.stringify(indexes, null, 2);

  return (
    <div>
      {isFetching ? (
        // <InlineLoading
        //   aria-live="assertive"
        //   description="Loading indexes…"
        //   iconDescription="Loading"
        //   status="active"
        // />
        <AILoadingComponent />
      ) : (
        <Editor
          height="calc(100vh - 170px)"
          defaultLanguage="json"
          theme={MONACO_THEME}
          value={editorValue}
          options={{
            ...defaultEditorOptions,
            readOnly: true,
            scrollBeyondLastLine: false,
            overviewRulerLanes: 0,
          }}
        />
      )}
    </div>
  );
};

export default IndexesViewComponent;
