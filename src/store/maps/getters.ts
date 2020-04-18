
import { GetterTree } from 'vuex';
import { MapState, Map } from './types';
import { RootState } from '../types';

const getters: GetterTree<MapState, RootState> = {
  getMap(state) {
    return (mapSlug: string): Map => state.maps[mapSlug];
  },
  getMaps(state) {
    return Object.values(state.maps);
  },
};
export default getters;
