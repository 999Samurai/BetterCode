<template>

    <div class="body">
 
        <navbar page="login"/>

        <br>

        <b-alert show dismissible variant="danger" v-if="this.$route.query.required" align="center">Login is required to access that page.</b-alert>
        <b-alert show dismissible variant="success" v-if="this.$route.query.changed" align="center">Your password has been changed.</b-alert>
        <b-alert show dismissible variant="danger" v-if="errors.has('password')" align="center">Password is required</b-alert>
        <b-alert show dismissible variant="danger" v-if="errors.has('email')" align="center">Email is required</b-alert>

        <b-alert show dismissible variant="danger" v-if="message && loginError" align="center">{{ message }}</b-alert>
        <b-alert show dismissible variant="success" v-if="message && status == 'success'" align="center">{{ message }}</b-alert>
        <b-alert show dismissible variant="warning" v-if="message && status == 'fail'" align="center">{{ message }}</b-alert>

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
                <form @submit.prevent="handleLogin" id="login" tabindex="500">
                    <h3>Login</h3>
                    <div class="mail">
                        <input
                            v-model="user.email"
                            v-validate="'required'"
                            type="email"
                            class="form-control"
                            name="email"
                        />
                        <label>Email</label>
                    </div>
                    <div class="passwd">
                        <input
                            v-model="user.password"
                            v-validate="'required'"
                            type="password"
                            class="form-control"
                            name="password"
                        />
                        <label>Password</label>
                    </div>
                    <a href="#" v-b-modal.modal-forgot-password><p style="text-align: left; font-size: 14px;">Forgot the password?</p></a>

                    <b-modal
                        id="modal-forgot-password"
                        ref="modal" 
                        title="Recover your password"
                        @ok="handleSubmitRecovery"
                    >
                        <form ref="form" @submit.stop.prevent="handleSubmitRecovery">
                            <b-form-group
                            label="Enter your account email"
                            label-for="email"
                            invalid-feedback="Enter your user account email address and we will send you a password reset link."
                            >
                            <b-form-input
                                id="email"
                                placeholder="email@test.com"
                                v-model="email"
                                :state="emailState"
                                v-validate="'required|min:3|max:20'"
                                required
                            ></b-form-input>
                            </b-form-group>
                            <vue-recaptcha
                                ref="recaptcha"
                                @verify="onCaptchaVerified"
                                sitekey="6LfGC9gZAAAAANxOuGnCc3tWUD0dKvigm1fVyZad">
                            </vue-recaptcha>
                        </form>
                    </b-modal>

                    <vue-recaptcha
                        ref="recaptcha"
                        @verify="onCaptchaVerified"
                        sitekey="6LfGC9gZAAAAANxOuGnCc3tWUD0dKvigm1fVyZad">
                    </vue-recaptcha>
                    <div class="submit">
                        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                        <button class="dark" :disabled="loading">Login</button>
                    </div>
                    <b-button variant="outline-dark" onclick="window.location.href='https://github.com/login/oauth/authorize?scope=user:email&client_id=62598e2904fb3b2ab5ea'">                      
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                        </svg>
                        Sign in with Github
                    </b-button>
                </form>
            </div>
        </div>	
    </div>

</template>

<script>

import navbar from './navbar.vue';
import VueRecaptcha from 'vue-recaptcha';
import User from '../models/user_login';
import userService from '../services/user.service';

export default {
    name: "login", 
    data(){
        return {
            user: new User('', '', ''),
            loading: false,
            status: '',
            recaptcha_token: '',
            email: '',
            loginError: 0,
            message: ''
        };
    },
    components: {
        navbar,
        VueRecaptcha
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
        emailState() {
            return this.email.includes("@") ? true : false
        }
    },
    created() {
        if (this.loggedIn) {
            this.$router.push('/dashboard');
        }
    },
    methods: {
        handleLogin() {

            this.loginError = 0;

            try {
                this.loading = true;
                this.$validator.validateAll().then(isValid => {
                    if (!isValid) {
                        this.loading = false;
                        return;
                    }

                    if (this.user.email && this.user.password && this.user.recaptcha) {
                        this.$store.dispatch('auth/login', this.user).then(() => {
                            if(localStorage.getItem('user') != null) {
                                this.$router.push('/dashboard');
                            } else {
                                this.loading = false;
                                this.loginError = 1;
                                this.message = "Incorrect email or password.";
                                window.grecaptcha.reset();
                            }
                        },
                        error => {
                            this.loading = false;
                            this.message = error.response || error.message || error.toString();
                        }
                    )}
                });
            } catch (err) {
                console.log(err);
            }

            window.grecaptcha.reset();

        },
        onCaptchaVerified: function (recaptchaToken) {
            this.user.recaptcha = recaptchaToken;
        },
        handleSubmitRecovery() {

            this.loginError = 0;

            userService.getPasswordRecovery(this.email, this.user.recaptcha).then(response => {
                this.status = response.data.status;
                this.message = response.data.message;
            });
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