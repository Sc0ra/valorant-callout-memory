<template>
  <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link
        class="navbar-item"
        to="/"
      >
        <img src="../assets/valorant-callouts-logo.svg" width="150" height="36">
      </router-link>
      <a
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        @click="isMenuActive = !isMenuActive"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div
      class="navbar-menu"
      :class="{'is-active': isMenuActive}"
    >
      <div class="navbar-start">
        <router-link
          class="navbar-item"
          to="/locate"
          @click.native="isMenuActive = false"
        >
          Locate
        </router-link>
        <p
          class="navbar-item has-text-grey"
          to="/connect"
          @click="isMenuActive = false"
        >
          Connect
        </p>
        <p
          class="navbar-item has-text-grey"
          to="/call"
          @click="isMenuActive = false"
        >
          Call
        </p>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <a href="https://twitter.com/Sc0ra" target="_blank" class="icon is-medium has-text-white">
            <i class="fab fa-twitter-square fa-2x" />
          </a>
        </div>
        <div class="navbar-item">
          <a href="https://github.com/Sc0ra/valorant-callouts" target="_blank" class="icon is-medium has-text-white">
            <i class="fab fa-github fa-2x" />
          </a>
        </div>
        <div class="navbar-item">
          <a href="https://discord.gg/NnPyNT" target="_blank" class="icon is-medium has-text-white">
            <i class="fab fa-discord fa-2x" />
          </a>
        </div>
        <div class="navbar-item">
          <a href="https://discord.gg/NnPyNT" target="_blank" class="button is-primary">
            Feedback and Bug Reports
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Navbar extends Vue {
  isMenuActive = false;
}
</script>

<style lang="scss" scoped>
  .navbar {
    position: sticky;
    top: 0;
  }
  .navbar-brand {
    .navbar-item {
      img {
        max-height: 2.5rem;
        border-right: solid 2px $red;
      }
    }
  }
  .navbar-menu {
    background-color: $dark;
  }
</style>
