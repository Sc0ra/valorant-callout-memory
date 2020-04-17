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
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        <a class="navbar-item">
          Home
        </a>
        <a class="navbar-item">
          Learn
        </a>
        <a class="navbar-item">
          Play
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Navbar extends Vue {}
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
</style>
