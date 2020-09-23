<template>
  <header>
    <b-navbar toggleable="lg" type="dark" class="navbar-horizontal" id="navbar">
      <b-navbar-brand href="#">BetterCode</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto" v-if="loggedin == true">
            <b-nav-item href="#" id="text">
                  <span class="nav-link-inner--text">Discover</span>
            </b-nav-item>
            <b-nav-item href="#">
              <b-button variant="primary" size="md" class="mb-2">
                <b-icon icon="person-fill" aria-hidden="true"></b-icon>Login  
              </b-button>
            </b-nav-item>
            <b-nav-item href="#">
              <b-button variant="outline-primary" size="md" class="mb-2">
                <b-icon icon="person" aria-hidden="true"></b-icon> Register  
              </b-button>
            </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto" v-else-if="loggedin == false">
            <b-nav-item href="#" id="text">
              <span class="nav-link-inner--text">Discover</span>
            </b-nav-item>
            <b-nav-item href="#">
              <b-button variant="primary" size="md" class="mb-2">
                <b-icon icon="person-fill" aria-hidden="true"></b-icon>Login  
              </b-button>
            </b-nav-item>
            <b-nav-item href="#">
              <b-button variant="outline-primary" size="md" class="mb-2">
                <b-icon icon="person" aria-hidden="true"></b-icon> Register  
              </b-button>
            </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </header>
</template>

<script>
export default {
  name: "navbar",
  data() {
    return {
    }
  }, 
  props: {
    loggedin: Boolean
  }
}
</script>

<style scoped>

  #navbar {
    margin-top: 5%;
  }
  
  #text {
    margin-top: 3.5%;
  }

  span {
    color: white;
  }

  button {
    margin-top: 5%;
  }

</style>
