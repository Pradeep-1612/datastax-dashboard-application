import { createHttpClient } from "./create-http-client.service";

const versionClient = createHttpClient("/api", undefined);

export interface AppVersion {
  version: string;
  releaseDate: string | null;
}

export const versionService = {
  getVersion(): Promise<{ data: AppVersion }> {
    return versionClient.get<AppVersion>("/version");
  },
};
