<template>
  
  <div>
    
    <navbar v-if="currentUser" :loggedin="true" v-bind:username="currentUser.username" :avatar="currentUser.avatar"/>

    <div class="row" style="margin-top: 5%">

      <h2 style="color: white;">Public Profile</h2>
      <hr style="color: #161B22; width: 100%; color: white; border-bottom: 1px solid #261B22;">

      <div class="col-8" style="margin-top: 2%;">

        <form>

          <h4 style="color: white;">Change Username</h4> 
          <input type="text" class="form-control" name="username" :value="currentUser.username">
          <p style="font-size: 12px; color: #8b949e; min-height: 17px; margin: 4px 0 2px;">Your username may appear around BetterCode on the discover page or your user page.</p>
        
          <br><br>  

          <h4 style="color: white;">Email</h4> 
          <input type="checkbox" id="show_email" name="username">
          <label for="show_email" style="color: white; padding-left: 10px;">Show email to other users</label>
          <p style="font-size: 12px; color: #8b949e; min-height: 17px; margin: 4px 0 2px;">Enabling this option will show your email on your public user page.</p>

        </form> 
      
      </div>

      <div class="col-4" style="margin-top: 2%; padding-left: 5%">
        <p style="color: white;">Profile picture</p>
        <button class="button">
          <vue-initials-img v-if="currentUser.avatar == 'default.png'" :name="currentUser.username" size="200" id="pick-avatar"/>     
          <img v-if="currentUser.avatar != 'default.png'" :src="getImagePath(avatar)" alt="user-image" id="pick-avatar">
        </button>
        <avatar-cropper
          :upload-headers="{ 'x-access-token': currentUser.auth }"
          trigger="#pick-avatar"
          :labels="{ submit: 'Submit', cancel: 'Cancel' }"
          upload-url="http://localhost:3000/api/user/avatar"
        />

      </div>
    </div>   
  </div>

</template>

<script>

import AvatarCropper from "vue-avatar-cropper"
import navbar from './navbar.vue'
import UserService from '../services/user.service';

export default {
  data() {
      return {
        settings_page: 'profile'
      }
  }, components: { AvatarCropper, navbar },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    getImagePath(photo) {
        return require('../assets/images/avatars/' + photo);
    }
  },
    beforeMount() {
        UserService.getUserProjects().then(response => {

            if(response.data.auth == true) {

                this.projects = response.data.projects;

            } else if (response.data.auth == false){ // Expired or invalid token

                this.$router.push('/logout');

            }
        });
    } 
}

</script>

<style scoped>

#pick-avatar {
  border-radius: 50%;
  width: 200px;
}

.button {
    background-color: Transparent;
    background-repeat: repeat;
    border: none;
    cursor: pointer;
    overflow: hidden;        
}

</style>