<template>
  
  <div>
    
    <navbar v-if="currentUser" :loggedin="true" v-bind:username="currentUser.username" :avatar="currentUser.avatar" :userId="currentUser.user_id"/>

    <b-alert show dismissible variant="danger" v-if="wrongPassword" align="center">Incorrect password.</b-alert>
    <b-alert show dismissible variant="danger" v-if="usernameInUse" align="center">Username is already in use.</b-alert>
    <b-alert show dismissible variant="success" v-if="success" align="center">Profile updated successfully.</b-alert>

    <div class="row" style="margin-top: 5%">
      <h2 style="color: white;" id="publicprofile">Public Profile</h2>
      <hr style="color: #161B22; width: 100%; color: white; border-bottom: 1px solid #261B22;">

      <div class="col-8" style="margin-top: 2%;">

        <form @submit.stop.prevent>

          <h4 style="color: white;">Change Username</h4> 
          <input type="text" class="form-control" name="username" v-model="user.username">
          <p style="font-size: 12px; color: #8b949e; min-height: 17px; margin: 4px 0 2px;">Your username may appear around BetterCode on the discover page or your user page.</p>
        
          <br><br>

          <h4 style="color: white;">Email</h4> 
          <input type="checkbox" id="show_email" name="email" v-model="user.show_email">
          <label for="show_email" style="color: white; padding-left: 10px;">Show email to other users</label>
          <p style="font-size: 12px; color: #8b949e; min-height: 17px; margin: 4px 0 2px;">Enabling this option will show your email on your public user page.</p>
          
          <br><br>

          <h4 style="color: white;">Bio</h4> 
          <textarea class="form-control" maxlength="160" id="bio" name="bio" v-model="user.bio"></textarea>
          <p style="font-size: 12px; color: #8b949e; min-height: 17px; margin: 4px 0 2px;">Your bio will appear on your profile.</p>

          <br>

          <button type="submit" v-b-modal.modal-prevent-closing class="btn btn-primary" style="background-color: #218434; border-color: #218434;">Update profile</button>

          <b-modal
          id="modal-prevent-closing"
          ref="modal" 
          title="Confirm your password"
          @ok="handleSubmit"
          >
              <form ref="form" @submit.stop.prevent="handleSubmit">
                  <b-form-group
                    label="Password"
                    label-for="password"
                    invalid-feedback="Password is required"
                  >
                    <b-form-input
                        id="password"
                        placeholder="Enter your password"
                        type="password"
                        v-model="user.password"
                        :state="passwordState"
                        v-validate="'required|min:3|max:50'"
                        trim
                    ></b-form-input>
                  </b-form-group>
              </form>
          </b-modal>
        </form> 
      </div>

      <div class="col-4" style="margin-top: 2%; padding-left: 5%">
        <p style="color: white; font-size: 18px;"><b>Edit profile picture</b></p>
        <button id="avatar_button">
          <vue-initials-img v-if="currentUser.avatar == 'default.png'" :name="currentUser.username" size="200" id="pick-avatar"/>     
          <img v-if="currentUser.avatar != 'default.png'" :src="getImagePath(currentUser.avatar)" alt="user-image" id="pick-avatar">
        </button>
        <avatar-cropper
          @uploaded="handleUploaded"
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
import user_profile from '../models/user_profile';
import UserService from '../services/user.service';

export default {
  data() {
      return {
        user: new user_profile('', '', '', ''),
        wrongPassword: false,
        usernameInUse: false,
        success: false
      }
  }, components: { AvatarCropper, navbar },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }, 
    passwordState() {
      return this.user.password.length > 2 ? true : false
    }
  },
  methods: {
    getImagePath(photo) {
        return require('../assets/images/avatars/' + photo);
    },
    handleUploaded(response) {
      if(response.success) {
        let userObject = JSON.parse(localStorage.getItem('user'));
        userObject.avatar = response.avatar;
        localStorage.setItem('user', JSON.stringify(userObject));
        location.reload();
      }
    },
    handleSubmit() {

      this.success = false;
      this.wrongPassword = false;
      this.usernameInUse = false;

      UserService.updateSettings(this.user).then(response => {
        if(response.data.success == true) { // Correct password
          this.success = true;

          let userObject = JSON.parse(localStorage.getItem('user'));
          userObject.username = this.user.username;
          localStorage.setItem('user', JSON.stringify(userObject));
          location.reload();

        } else if (response.data.error == true) { // Username in use.
          this.usernameInUse = true;
        } else { // Wrong password
          this.wrongPassword = true;
        }
      })
    }
  },
  beforeMount() {
    UserService.getUserSettings().then(response => {
      if(response.data.auth == true) {
          this.user.username = response.data.user.username;
          this.user.show_email = response.data.user.show_email;
          this.user.bio = response.data.user.bio;
      } else if (response.data.auth == false){ // Expired or invalid token
          this.$router.push('/logout');
      }
    });
  } 
}

</script>

<style scoped>

#avatar_button:hover {
    filter: blur(4px);
}

#pick-avatar {
  border-radius: 50%;
  width: 200px;
}

#avatar_button {
    background-color: Transparent;
    background-repeat: repeat;
    border: none;
    cursor: pointer;
    overflow: hidden;        
}

</style>