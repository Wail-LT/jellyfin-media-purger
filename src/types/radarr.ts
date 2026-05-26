export interface RadarrMovie {
  id: number;
  title: string;
  tmdbId: number;
  imdbId?: string;
  monitored: boolean;
  hasFile: boolean;
  path?: string;
}
