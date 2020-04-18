<template>
  <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img src="../assets/valorant-callouts-logo.svg" width="150" height="36">
      </a>
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
          to="/"
        >
          Home
        </router-link>
        <router-link
          class="navbar-item"
          to="/locate"
        >
          Locate
        </router-link>
        <p
          class="navbar-item has-text-grey"
          to="/connect"
        >
          Connect
        </p>
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
