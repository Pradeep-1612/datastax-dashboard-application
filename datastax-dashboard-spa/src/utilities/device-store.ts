export interface QueryEditorState {
    queryHistory: { query: string; executionTime: number; lastRunAt: string; success: boolean }[];
}

export function getQueryEditorStateKey(): string {
    const configUrl = sessionStorage.getItem("config_url");
    if (configUrl) {
        try {
            const { host } = new URL(configUrl);
            return `DataOnTheHouse_QueryEditorState_${host}`;
        } catch {
            // fall through to default
        }
    }
    return "DataOnTheHouse_QueryEditorState";
}

export function getQueryEditorStateValue<K extends keyof QueryEditorState>(key: K): QueryEditorState[K] {
    const stored = localStorage.getItem(getQueryEditorStateKey());
    const state: Partial<QueryEditorState> = stored ? JSON.parse(stored) : {};
    return (state[key] ?? []) as QueryEditorState[K];
}

export function setQueryEditorStateValue<K extends keyof QueryEditorState>(key: K, value: QueryEditorState[K]): void {
    const storageKey = getQueryEditorStateKey();
    const stored = localStorage.getItem(storageKey);
    const state: Partial<QueryEditorState> = stored ? JSON.parse(stored) : {};
    localStorage.setItem(storageKey, JSON.stringify({ ...state, [key]: value }));
}


export const getQueryHistory = () => getQueryEditorStateValue("queryHistory");