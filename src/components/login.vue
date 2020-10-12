<template>

    <div class="body">
 
        <navbar page="login"/>

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
                <form id="login" tabindex="500">
                    <h3>Login</h3>
                    <div class="mail">
                        <input type="email" name="" required>
                        <label>Email</label>
                    </div>
                    <div class="passwd">
                        <input type="password" name="" required>
                        <label>Password</label>
                    </div>
                    <a href=""><p style="text-align: left; font-size: 14px;">Forgot the password?</p></a>
                    <div class="submit">
                        <button class="dark">Login</button>
                    </div>
                    <b-button variant="outline-dark" style="margin-top: 20px" onclick="window.location.href='https://github.com/login/oauth/authorize?scope=user:email&client_id=62598e2904fb3b2ab5ea'">
                        Sign in with Github <i class="fa fa-github"></i>
                    </b-button>
                </form>
            </div>
        </div>	
    </div>


</template>

<script>

import navbar from './navbar.vue'

export default {
    name: "login", 
    data(){
        return {}
    },
    components: {
        navbar
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
        padding-top: 20%;
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