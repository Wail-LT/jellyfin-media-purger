export interface JellyfinUser {
  Id: string;
  Name: string;
}

export interface JellyfinUserData {
  Played?: boolean;
  LastPlayedDate?: string;
  PlayCount?: number;
  PlaybackPositionTicks?: number;
}

export interface JellyfinItem {
  Id: string;
  Name: string;
  Type: string;
  Path?: string;
  ProviderIds?: Record<string, string>;
  UserData?: JellyfinUserData;
}

export interface JellyfinItemsResponse {
  Items: JellyfinItem[];
  TotalRecordCount: number;
}
