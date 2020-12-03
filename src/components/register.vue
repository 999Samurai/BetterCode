<template>
    <div class="body">

        <navbar page="register"/>

        <br>
        
        <b-alert show variant="warning" v-if="this.status == 'fail'" align="center">{{ this.message }}</b-alert>
        <b-alert show variant="success" v-if="this.status == 'success'" align="center">{{ this.message }}</b-alert>
        <b-alert show variant="empty" v-if="this.status == 'warning'" align="center">{{ this.message }}</b-alert>
        <div class="form-div">
            <div class="rgstr-btn splits">
                <p>Already registered?</p>
                <button class="active">Login</button>
            </div>
            <div class="login-btn splits">
                <p>Already registered?</p>
                <button class="active" onclick="window.location.href='/login'">Login</button>
            </div>
            <div class="wrapper">
                <form v-on:submit.prevent id="login" tabindex="500">
                    <h3>Register</h3>
                    <div class="first_name" style="float: left; width: 50%;">
                        <input type="text" id="first_name" required>
                        <label>First Name</label>
                    </div>
                    <div class="last_name" style="float: right; width: 50%; padding-left: 5px">
                        <input type="text" id="last_name" required>
                        <label>Last Name</label>
                    </div>
                    <div class="mail" style="clear: both;">
                        <input type="email" id="email" required>
                        <label>Email</label>
                    </div>
                    <div class="uid">
                        <input type="text" id="username" required>
                        <label>Username</label>
                    </div>
                    <div class="passwd" style="float: left; width: 50%">
                        <input type="password" id="password" required>
                        <label>Password</label>
                    </div>
                    <div class="passwd" style="float: right; width: 50%; padding-left: 5px">
                        <input type="password" id="confirm_password" required>
                        <label>Confirm password</label>
                    </div>
                    <div style="clear: both;"></div>
                    <vue-recaptcha
                    ref="recaptcha"
                    @verify="onCaptchaVerified"
                    sitekey="6LfGC9gZAAAAANxOuGnCc3tWUD0dKvigm1fVyZad">
                    </vue-recaptcha>
                    <div class="submit">
                        <button class="dark" v-on:click="register()">Register</button>
                    </div>
                </form>
            </div>
        </div>	
    </div>
</template>

<script>

import navbar from './navbar.vue';
import axios from 'axios';
import VueRecaptcha from 'vue-recaptcha';

export default {
    name: "register", 
    data(){
        return {
            disable: false
        }
    },
    components: {
        navbar,
        VueRecaptcha
    },
    props: {

        status: String,
        message: String,
        recaptcha_token: String

    },
    methods: {
        register: function() {

            this.disable = true;            

            let server_ip = window.location.protocol + "//" + window.location.hostname;

            axios.post(server_ip + ":3000/api/register", {
                
                first_name: document.getElementById('first_name').value,
                last_name: document.getElementById('last_name').value,
                email: document.getElementById('email').value,
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
                recaptcha: this.recaptcha_token || null

            }).then(response => {

                this.status = response.data.status;
                this.message = response.data.message;

            })
        },
        onCaptchaVerified: function (recaptchaToken) {
            this.recaptcha_token = recaptchaToken;
        }
    },
    beforeCreate(){
        let server_ip = window.location.protocol + "//" + window.location.hostname;
        axios.get(server_ip + ":3000/api/check_session")
        .then(response => {

            if(response.data.status == "success") {

                // Session Found
                this.loggedin = true;
                this.username = response.data.username;

            } else if (response.data.status == "fail") {

                // No Session Found
                this.loggedin = false;

            } else {

                // Error
                this.loggedin = false;
                
            }
        })    
    }
}
</script>

<style scoped>

    .form-div {

        transition: all .5s;
        padding: 1px;

        width: 100%;
        margin: 75px auto;
        background: rgba(255,255,255,.5);
        min-height: 400px;
        display: table;
        position: relative;
        box-shadow: 0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28);
    }

    .form-div > div {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        color: #fff;
    }

    button {
        background: transparent;
        display: inline-block;
        padding: 10px 30px;
        border: 3px solid #fff;
        border-radius: 50px;
        background-clip: padding-box;
        position: relative;
        color: #FFF;
        transition: all .25s;
    }

    .form-div button.dark {
        border-color: #213C53;
        background: #213C53;
    }

    .form-div .move button.dark {
        border-color: #000000;
        background: #000000;
    }

    .form-div .splits p {
        font-size: 18px;
    }

    .form-div button:active {
        box-shadow: none;			
    }

    .form-div button:focus{
        outline: none;			
    }

    .form-div > .wrapper {
        position: absolute;
        width: 40%;
        height: 120%;
        top: -10%;
        left: 5%;
        background: #fff;
        box-shadow: 0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28);
        transition: all .5s;
        color: #303030;
        overflow: hidden;
    }

    .form-div .wrapper > form{
        padding: 15px 30px 30px;
        width: 100%;
        transition: all .5s;
        background: #fff;
        width: 100%; 
    }

    .form-div .wrapper > form:focus{
        outline: none;
    }

    .form-div .wrapper #login{
        padding-top: 5%;
        visibility: visible;
    }

    .form-div .wrapper #register{
        transform: translateY(-80%) translateX(100%);
        visibility: hidden;
    }

    .form-div .wrapper.move #register{
        transform: translateY(-80%) translateX(0%);
        visibility: visible;
    }

    .form-div .wrapper > form > div {
        position: relative;
        margin-bottom: 15px;
    }

    .form-div .wrapper label {
        position: absolute;
        top: -7px;
        font-size: 12px;
        white-space: nowrap;
        background: #fff;
        text-align: left;
        left: 15px;
        padding: 0 5px;
        color: #999;
        pointer-events: none;
    }

    .form-div .wrapper h3 {
        margin-bottom: 25px;
    }
    
    .form-div .wrapper input {
        height: 40px;
        padding: 5px 15px;
        width: 100%;
        border: solid 1px #999;
    }

    .form-div .wrapper input {
        height: 40px;
        padding: 5px 15px;
        width: 100%;
        border: solid 1px #999;
    }

    .form-div .wrapper input:focus {
        outline: none;
        border-color: #ff4931;
    }

    .form-div > .wrapper.move {
        left: 45%;
    }

    .form-div > .wrapper.move input:focus {
        border-color: #e0b722;
    }

</style>