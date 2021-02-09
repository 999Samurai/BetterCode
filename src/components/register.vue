<template>
    <div class="body">

        <navbar page="register"/>

        <br>
        
        <b-alert show dismissible variant="danger" v-if="submitted && errors.has('username')" align="center">{{errors.first('username')}}</b-alert>
        <b-alert show dismissible variant="danger" v-if="submitted && errors.has('password')" align="center">{{errors.first('password')}}</b-alert>
        <b-alert show dismissible variant="danger" v-if="submitted && errors.has('email')" align="center">{{errors.first('email')}}</b-alert>
        <b-alert show dismissible variant="danger" v-if="submitted && errors.has('password_confirmation')" align="center">{{errors.first('password_confirmation')}}</b-alert>

        <b-alert show dismissible variant="success" v-if="successful" align="center">{{ message }}</b-alert>
        <b-alert show dismissible variant="danger" v-if="submitted && !successful && message" align="center">{{ message }}</b-alert>


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
                <form @submit.prevent="handleRegister" id="login" tabindex="500">
                    <h3>Register</h3>
                    <div class="mail">
                        <input
                        v-model="user.email"
                        v-validate="'required|email|max:50'"
                        type="email"
                        class="form-control"
                        name="email"
                        />                        
                        <label>Email</label>
                    </div>
                    <div class="uid">
                        <input
                        v-model="user.username"
                        v-validate="'required|min:6|max:20'"
                        type="text"
                        class="form-control"
                        name="username"
                        />                        
                    <label>Username</label>
                    </div>
                    <div class="passwd" style="float: left; width: 50%">
                        <input
                        ref="pass"
                        v-model="user.password"
                        data-vv-name="pass"
                        v-validate="'required|min:6|max:20'"
                        type="password"
                        class="form-control"
                        name="pass"
                        />                        
                        <label>Password</label>
                    </div>
                    <div class="passwd" style="float: right; width: 50%; padding-left: 5px">
                        <input
                        v-validate="'required|confirmed:pass'"
                        type="password"
                        class="form-control"
                        name="password"
                        />                              
                        <label>Confirm password</label>
                    </div>
                    <div style="clear: both;"></div>
                    <vue-recaptcha
                    ref="recaptcha"
                    @verify="onCaptchaVerified"
                    sitekey="6LfGC9gZAAAAANxOuGnCc3tWUD0dKvigm1fVyZad">
                    </vue-recaptcha>
                    <div class="submit">
                        <button class="dark" :visible="loading">Register</button>
                        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                    </div>
                </form>
            </div>
        </div>	
    </div>
</template>

<script>

import navbar from './navbar.vue';
import User from '../models/user_register';
import VueRecaptcha from 'vue-recaptcha';

export default {
    name: "register", 
    data(){
        return {
            user: new User('', '', '', '', '', ''),
            loading: false,
            submitted: false,
            successful: false,
            message: '',
            recaptcha_token: ''
        }
    },
    components: {
        navbar,
        VueRecaptcha
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        }
    },
    mounted() {
        if (this.loggedIn) {
            this.$router.push('/dashboard');
        }
    },

    methods: {    
    
        handleRegister() {

            this.loading = true;
            this.message = '';
            this.submitted = true;
            this.$validator.validate().then(isValid => {
                if (!isValid) {
                    this.loading = false;
                    window.grecaptcha.reset();
                    return;
                }
                this.$store.dispatch('auth/register', this.user).then(
                    data => {
                        this.message = data.message;
                        this.successful = true;
                    },
                    error => {
                        this.message = (error.response && error.response.data) || error.message || error.toString();
                        this.successful = false;
                        this.loading = false;
                        window.grecaptcha.reset();
                    }
                );
            });
        },
        onCaptchaVerified: function (recaptchaToken) {
            this.user.recaptcha = recaptchaToken;
        }
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