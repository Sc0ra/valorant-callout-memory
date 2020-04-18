import { ActionTree } from 'vuex';

import { MapState, Map } from './types';
import { RootState } from '../types';
import { api } from '../api';
import normalize from './normalizer';

const actions: ActionTree<MapState, RootState> = {
  async fetchMaps({ commit }) {
    const res = await api.get('maps.json');
    const mapList: Map[] = res && res.data;
    commit('setMaps', normalize(mapList));
  },
};
export default actions;
