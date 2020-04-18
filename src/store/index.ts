import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

import { RootState } from './types';
import { maps } from './maps';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  modules: {
    maps,
  },
};

export default new Vuex.Store<RootState>(store);
