<template>

    <div>
    
        <navbar v-if="currentUser" :loggedin="true" :currentUser="currentUser"/>
        <navbar v-if="!currentUser" :loggedin="false"/>

        <h1 align="center" v-if="Object.keys(user_info).length == 0" style="color: white; margin-top: 10%">User not found.</h1>
        
        <div v-if="user_info.not != 'empty' && Object.keys(user_info).length != 0" style="margin-top: 5%">

            <vue-initials-img v-if="user_info.avatar == 'default.png'" :name="user_info.username" size="150" style="border-radius: 10px; float: left; margin-right: 1%;"/>     
            <img v-if="user_info.avatar != 'default.png'" :src="getUserImagePath(user_info.avatar)" width="178px" height="178px" alt="user-image" id="user_image" style="border-radius: 10px; float: left; margin-right: 1%;">
            <h3 style="color: white; padding-top: 1%">{{ user_info.username }}</h3>
            <h6 style="color: gray" v-if="user_info.show_email">{{ user_info.email }}</h6>
            <p style="color: white; padding-top: 5%">{{ user_info.bio }}</p>

            <div class="projects" style="clear: both; padding-top: 10px;">
        
                <h3 style="color: white; padding-top: 10px;">Projects</h3>
                <hr style="color: white; width: 100%; color: white; border-bottom: 1px solid white;">

                <p align="center" style="color: white;" v-if="isLoaded && projects.length == 0">This user don't have created/public projects.</p>

                <div class="row"> 
                    <div v-for="project in projects" v-bind:key="project.id">
                        <a :href="'/pen/' + project.id">
                            <b-card
                            no-body
                            img-height="125px"
                            bg-variant="white"
                            style="width: 15rem; margin: 10px; color: black;"
                            v-bind:img-src="getThumbImagePath(project.project_thumb)"
                            img-alt="Project Image"
                            img-top
                            >
                                <template #header>
                                    <h5 class="mb-0">{{ project.project_name }}</h5>
                                </template>
                            </b-card>
                        </a>
                    </div>
                    <SkeletonCard v-if="!isLoaded" primary="white" structure="73" style="width: 15rem; margin: 10px;" :borderRadius="10" />
                    <SkeletonCard v-if="!isLoaded" primary="white" structure="73" style="width: 15rem; margin: 10px;" :borderRadius="10" />
                    <SkeletonCard v-if="!isLoaded" primary="white" structure="73" style="width: 15rem; margin: 10px;" :borderRadius="10" />
                    <SkeletonCard v-if="!isLoaded" primary="white" structure="73" style="width: 15rem; margin: 10px;" :borderRadius="10" />
                    <SkeletonCard v-if="!isLoaded" primary="white" structure="73" style="width: 15rem; margin: 10px;" :borderRadius="10" />
                </div>
            </div>
        </div>
    </div>
</template>


<script>

import UserService from '../services/user.service';
import navbar from './navbar.vue';

export default {
    data() {
        return {
            projects: [],
            user_info: {"not": "empty"},
            isLoaded: false
        }
    },
    methods: {
        getUserImagePath(photo) {
            return require('../assets/images/avatars/' + photo);
        },

        getThumbImagePath(photo) {
            return require('../assets/images/thumbs/' + photo);
        },
        sleep(ms) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }
    },
    components: {
      navbar  
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        }
    },
    beforeMount() {
        UserService.getPublicUserInfo(this.$route.params.id).then(async (response) => {

            if(response.data.success == true) {
                this.user_info = response.data.user;
                await this.sleep(1450);
                this.isLoaded = true;
                this.projects = response.data.projects;
            } else {
                this.user_info = {};
                await this.sleep(1450);
                this.isLoaded = true;
                this.projects = [];
            }
        });
    }
}

</script>

<style scoped>

    a:link {
        color: black;
    }

    a:visited {
        color: black;
    }

    a:hover {
        color: black;
        text-decoration: none;
    }

</style>