export interface Place {
  callout: string;
  x: number;
  y: number;
}

export interface Map {
  mapSlug: string;
  mapName: string;
  mapHero: string;
  mapLayout: string;
  height: number;
  width: number;
  places: Place[];
}

export interface MapDict {
  [mapSlug: string]: Map;
}

export interface MapState {
  maps: MapDict;
}
