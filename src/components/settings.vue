<template>
  
  <div>
    <div class="d-flex" id="wrapper">
      <div class="bg-secondary" id="sidebar-wrapper">
        <div class="center">
          <b-navbar-brand href="/" style="margin-left: 10px;">BetterCode</b-navbar-brand><br>
          <vue-initials-img v-if="currentUser.avatar == 'default.png'" :name="currentUser.username" size="100" class="rounded-circle" style="margin-bottom: 2px;"/>     
          <img v-if="currentUser.avatar != 'default.png'" :src="getImagePath(currentUser.avatar)" alt="user-image" id="user_image" class="rounded-circle">
        </div>
        <div class="list-group list-group-flush">
          <a class="list-group-item list-group-item-action bg-dark" style="cursor: pointer" @click="settings_page = 'profile'">Profile</a>
          <a class="list-group-item list-group-item-action bg-dark" style="cursor: pointer" @click="settings_page = 'account'">Account</a>
          <a class="list-group-item list-group-item-action bg-dark" style="cursor: pointer" @click="settings_page = 'account_security'">Account Security</a>
          <a class="list-group-item list-group-item-action bg-dark" style="cursor: pointer" @click="settings_page = 'plans'">Billing & Plans</a>
          <hr style="color: white; width: 100%; color: black; border-bottom: 1px solid black;">
        </div>
      </div>

      <div id="page-content-wrapper" style="padding-top: 1%; width: 100%; height: 100%;">
        <div class="container-fluid">
          <div class="card bg-secondary text-white" v-if="settings_page == 'profile'">
              <div class="card-body">
              
                <h3>Edit Profile Settings</h3>

              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
      return {
        settings_page: 'profile'
      }
  },
  computed: {
    currentUser() {
        if(this.$store.state.auth.status.loggedIn) {
            return this.$store.state.auth.user;
        } else {
            return "";
        }
    }
  },
  methods: {
    getImagePath(photo) {
        return require('../assets/images/avatars/' + photo);
    }
  }
}

</script>

<style scoped>

  #wrapper {
    font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    margin-left: -21.45%;
    margin-right: -21.45%;
  }

  #sidebar-wrapper {
    background-color: #343a40 !important;
    width: 25vw;
    height: 100vh;
    color: white;
  }

  .center {
    text-align: center;
    margin: auto;
    width: 75%;
    padding: 10px;
  }

  a {
      color: white;
  }

  a:hover {
    text-decoration: none;
    color: white;
  }
  
  .rounded-circle {
    border-radius: 50%!important;
  }

  #user_image {
    height: 100px;
    width: 100px;
    margin-right: 5px;
  }

</style>