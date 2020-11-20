<template>

    <div class="body">
 
        <navbar page="login"/>
        <b-alert show variant="warning" v-if="this.status == 'fail'" align="center">{{ this.message }}</b-alert>
        <b-alert show variant="success" v-if="this.status == 'success'" align="center">{{ this.message }}</b-alert>
        <b-alert show variant="empty" v-if="this.status == 'warning'" align="center">{{ this.message }}</b-alert>
        <div class="veen">
            <div class="rgstr-btn splits">
                <p>Don't have an account?</p>
                <button class="active" id="btn" onclick="window.location.href='/register'">Register</button>
            </div>
            <div class="rgstr-btn splits">
                <p>Don't have an account?</p>
                <button class="active" id="btn" onclick="window.location.href='/register'">Register</button>
            </div>
            <div class="wrapper">
                <form v-on:submit.prevent id="login" tabindex="500">
                    <h3>Login</h3>
                    <div class="mail">
                        <input type="email" name="email" id="email" required>
                        <label>Email</label>
                    </div>
                    <div class="passwd">
                        <input type="password" name="password" id="password" required>
                        <label>Password</label>
                    </div>
                    <a href=""><p style="text-align: left; font-size: 14px;">Forgot the password?</p></a>
                    <vue-recaptcha
                    ref="recaptcha"
                    @verify="onCaptchaVerified"
                    sitekey="6LfGC9gZAAAAANxOuGnCc3tWUD0dKvigm1fVyZad">
                    </vue-recaptcha>
                    <div class="submit">
                        <button class="dark" v-on:click="login()">Login</button>
                    </div>
                    <b-button variant="outline-dark" onclick="window.location.href='https://github.com/login/oauth/authorize?scope=user:email&client_id=62598e2904fb3b2ab5ea'">
                        Sign in with Github <i class="fa fa-github"></i>
                    </b-button>
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
    name: "login", 
    data(){
        return {}
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
        login: function() {

            let server_ip = window.location.protocol + "//" + window.location.hostname;

            axios.post(server_ip + ":3000/api/login", {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                recaptcha: this.recaptcha_token || null
            }).then(response => {

                if(response.data.status == "fail") {
        
                    this.disable = false;

                } else if (response.data.status == "success") {

                    this.disable = true;

                } else if (response.data.status == "captcha") {

                    location.reload();

                } else {
                    
                    this.disable = false;

                }

                this.status = response.data.status;
                this.message = response.data.message;

            })
        },
        onCaptchaVerified: function (recaptchaToken) {
            this.recaptcha_token = recaptchaToken;
        }
    }
}

</script>

<style scoped>

    .veen {

        transition: all .5s;
        padding: 1px;

        width: 100%;
        margin: 100px auto;
        background: rgba(255,255,255,.5);
        min-height: 400px;
        display:table;
        position: relative;
        box-shadow: 0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28);
    }

    .veen > div {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        color: #fff;
    }

    #btn {
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

    .veen button.dark {

        background: transparent;
        display: inline-block;
        padding: 10px 30px;

        border: 3px solid #fff;
        border-radius: 50px;
        background-clip: padding-box;
        position: relative;
        color: #FFF;
        transition: all .25s;

        border-color: #213C53;
        background: #213C53;
    }

    .veen .move button.dark {
        border-color: #000000;
        background: #000000;
    }

    .veen .splits p {
        font-size: 18px;
    }

    .veen button:active {
        box-shadow: none;			
    }

    .veen button:focus{
        outline: none;			
    }

    .veen > .wrapper {
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

    .veen .wrapper > form{
        padding: 15px 30px 30px;
        width: 100%;
        transition: all .5s;
        background: #fff;
        width: 100%; 
    }

    .veen .wrapper > form:focus{
        outline: none;
    }

    .veen .wrapper #login{
        padding-top: 5%;
        visibility: visible;
    }

    .veen .wrapper #register{
        transform: translateY(-80%) translateX(100%);
        visibility: hidden;
    }

    .veen .wrapper.move #register{
        transform: translateY(-80%) translateX(0%);
        visibility: visible;
    }
    
    .veen .wrapper.move #login{
        transform: translateX(-100%);
        visibility: hidden;
    }
    
    .veen .wrapper > form > div {
        position: relative;
        margin-bottom: 15px;
    }

    .veen .wrapper label{
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

    .veen .wrapper h3{
        margin-bottom: 25px;
    }
    
    .veen .wrapper input{
        height: 40px;
        padding: 5px 15px;
        width: 100%;
        border: solid 1px #999;
    }

    .veen .wrapper input{
        height: 40px;
        padding: 5px 15px;
        width: 100%;
        border: solid 1px #999;
    }

    .veen .wrapper input:focus{
        outline: none;
        border-color: #ff4931;
    }

    .veen > .wrapper.move{
        left: 45%;
    }

    .veen > .wrapper.move input:focus{
        border-color: #e0b722;
    }

</style>