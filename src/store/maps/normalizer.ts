import { Map, MapDict } from './types';

const normalize = (mapList: Map[]) => mapList.reduce(
  (maps: MapDict, map: Map) => ({
    ...maps,
    [map.mapSlug]: map,
  }),
  {},
);

export default normalize;
