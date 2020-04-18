import { Module } from 'vuex';
import { MapState } from './types';
import { RootState } from '../types';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

export const state: MapState = {
  maps: {},
};

const namespaced = true;

export const maps: Module<MapState, RootState> = {
  namespaced,
  state,
  actions,
  mutations,
  getters,
};
