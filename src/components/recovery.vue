<template>
    <b-container>
        <navbar/>


        <b-row style="margin-top: 15%;" align-v="center" align="center">

            <form class="col-12">
                <b-alert show dismissible variant="danger" v-if="!password_confirmation" align="center">The password confirmation does not match</b-alert>
                <h1>Reset password</h1>
                <hr style="color: #161B22; width: 400px; color: white; border-bottom: 1px solid #261B22;">
                <div class="form-group" style="width: 400px;">
                    <input 
                        v-model="password"
                        placeholder="New Password"
                        type="password"
                        class="form-control"
                        name="pass"
                    >
                </div>
                <div class="form-group" style="width: 400px;">
                    <input 
                        v-model="conf_password"
                        type="password"
                        placeholder="Confirm password"
                        class="form-control"
                        name="password"
                    >
                </div>
                <input @click="submit()" type="button" class="btn btn-primary" value="Submit" style="width: 400px;">
            </form>   
        </b-row>
    </b-container>
</template>

<script>

import navbar from './navbar.vue';
import userService from '../services/user.service';

    export default {
        data(){
            return {

                password: '',
                conf_password: '',
                password_confirmation: true,
                submitted: false

            };
        },
        components: {
            navbar,
        },
        methods: {
            submit() {

                this.submitted = true;

                if(this.password != this.conf_password) {
                    this.password_confirmation = false;
                } else {
                    this.password_confirmation = true;
                    userService.changePassword(this.$route.params.uuid, this.password).then(() => {

                        this.$router.push('/login?changed=true');

                    });
                }

            }
        },
        beforeCreate() {
            userService.checkRecovery(this.$route.params.uuid).then(response => {
                if(response.data.success) {
                    return;
                } else {
                    this.$router.push('/login');
                }
            })
        }
    }
</script>

<style scoped>
    .container, .row {
        height: 100%;
        min-height: 100%;
    }

    .container {
        height: 100%;
        color: white;
    }
</style>