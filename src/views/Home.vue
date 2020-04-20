<template>
  <div class="home">
    <img
      src="../assets/valorant-callouts-logo.svg"
      alt="Valorant Callouts"
      class="logo"
    >
    <p>
      Valorant callouts is a bundle of 3 minigames to help you learn different
      callouts in Riot Game's Competitive Shooter:
      <span class="has-text-primary">Valorant</span>
    </p>
    <div class="columns is-variable is-1-mobile is-8-widescreen">
      <div class="column">
        <router-link class="minigame" to="/locate" tag="div">
          <h3 class="subtitle is-3 has-text-primary">
            Locate
          </h3>
          <span class="icon is-large">
            <i class="fas fa-search-location fa-3x" />
          </span>
          <p>
            Find the location on the map of the given callout.
          </p>
        </router-link>
      </div>
      <div class="column">
        <div class="minigame has-text-grey" to="/connect" tag="div">
          <h3 class="subtitle is-3 has-text-grey">
            Connect
          </h3>
          <span class="icon is-large">
            <i class="fas fa-link fa-3x" />
          </span>
          <p>
            Associate locations and callouts on the map.
          </p>
          <span class="comming-soon has-text-primary"> Comming Soon™</span>
        </div>
      </div>
      <div class="column">
        <div class="minigame has-text-grey" to="/call" tag="div">
          <h3 class="subtitle is-3 has-text-grey">
            Call
          </h3>
          <span class="icon is-large">
            <i class="fas fa-microphone-alt fa-3x" />
          </span>
          <p>
            Find the callout associated with the given position.
          </p>
          <span class="comming-soon has-text-primary"> Comming Soon™</span>
        </div>
      </div>
    </div>
    <p>
      The game is curently in closed beta as I develop the website so maps may
      change in the near future. Also, callouts are not yet perfectly defined by the
      community.
    </p>
    <p>
      For now, I will use
        <a href="https://blitz.gg/valorant/maps" target="_blank">blitz.gg</a>
      callouts as a reference for what I am doing.
      All credits for the map layout goes to them.
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Home extends Vue {
}
</script>

<style lang="scss" scoped>
.logo {
  margin-top: 1rem;
  max-width: 20rem;
  margin-bottom: 3rem;
}
p {
  margin-bottom: 1.5rem;
  text-align: justify;
  text-align-last: center;
}
.columns {
  margin: auto;
  margin-bottom: 2rem;
}
.minigame {
  position: relative;
  border: 1px solid $white;
  border-radius: 5px;
  padding: 1rem;
  &:hover {
    cursor: pointer;
  }
  .icon {
    margin-bottom: 1rem;
  }
  .comming-soon {
    position: absolute;
    top: 5%;
    right: 2%;
  }
}
</style>
