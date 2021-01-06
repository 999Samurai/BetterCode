<template>
  <header>
    <b-navbar toggleable="lg" type="dark" class="navbar-horizontal" id="navbar">
      <b-navbar-brand href="/">BetterCode</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto" v-if="loggedin == false && page != 'login' && page != 'register'">
            <b-nav-item href="#" id="text">
                  <span class="nav-link-inner--text">Discover</span>
            </b-nav-item>
            <b-nav-item href="/login">
              <b-button variant="primary" size="md" class="mb-2">
                <b-icon icon="person-fill" aria-hidden="true"></b-icon>Login  
              </b-button>
            </b-nav-item>
            <b-nav-item href="/register">
              <b-button variant="outline-primary" size="md" class="mb-2">
                <b-icon icon="person" aria-hidden="true"></b-icon> Register  
              </b-button>
            </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto" v-else-if="loggedin == true && page != 'login' && page != 'register'">
            <b-nav-item href="#" class="text">
              <span class="nav-link-inner--text">Discover</span>
            </b-nav-item>
            <b-nav-item href="/dashboard" class="text">
              <span class="nav-link-inner--text">Dashboard</span>
            </b-nav-item>
            <b-nav-item-dropdown right class="button">
              <template #button-content>
                <img src="../assets/images/avatars/user.png" alt="user-image" id="user_image" class="rounded-circle"><span> {{ username }}</span>
              </template>
              <img src="../assets/images/avatars/user.png" alt="user-image" id="menu_image" class="rounded-circle">
              <p style="color: black; font-size: 15px; text-align: center; margin-bottom: 20px;">Welcome, {{ username }}!</p>
              <b-dropdown-item href="/settings" style="text-align: center;"><b-icon icon="gear"></b-icon> Settings</b-dropdown-item>
              <div class="dropdown-divider"></div>
              <b-dropdown-item href="/logout" style="text-align: center;"><b-icon icon="box-arrow-right"></b-icon> Logout</b-dropdown-item>
            </b-nav-item-dropdown>  
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
    loggedin: Boolean,
    username: String,
    page: String
  }
}
</script>

<style scoped>

  #navbar {
    margin-top: 5%;
  }
  
  #text {
    margin-top: 3%;
  }

  span {
    color: white;
  }

  button {
    margin-top: 5%;
  }

  .text {
    margin-top: 5%;
  }

  .button {
    margin-top: 3%;
  }

  .button:hover {
    background-color: black;
  }

  #user_image {
    height: 32px;
    width: 32px;
    margin-right: 5px;
  }

  #menu_image {
    height: 100px;
    width: 100px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .rounded-circle {
    border-radius: 50%!important;
  }

</style>
