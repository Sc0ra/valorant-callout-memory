import { MutationTree } from 'vuex';
import { MapState, MapDict } from './types';

const mutations: MutationTree<MapState> = {
  setMaps(state, maps: MapDict) {
    state.maps = maps;
  },
};
export default mutations;
