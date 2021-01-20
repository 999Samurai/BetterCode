<template>
    <div>
    
        
        <navbar v-if="currentUser" :loggedin="true" v-bind:username="currentUser.username" :avatar="currentUser.avatar"/>
        <navbar v-if="!currentUser" :loggedin="false"/>

        <div class="projects">
            <div class="row">
                <p align="center" v-if="projects.length == 0" style="color: white;">There is no more projects to show.</p>

                <div v-for="project in projects" v-bind:key="project.id">
                    <a :href="'/pen/' + project.id">
                        <b-card
                        no-body
                        img-height="125px"
                        bg-variant="dark"
                        style="width: 16rem; margin: 10px; color: white;"
                        v-bind:img-src="getThumbImagePath(project.project_thumb)"
                        img-alt="Project Image"
                        img-top
                        >
                            <template #header>
                                <div class="row">
                                   <div class="col-md-3">
                                        <a :href="'/user-' + project.creater_id">
                                            <vue-initials-img v-if="project.avatar == 'default.png'" :name="project.username" size="40" style="border-radius: 10px;"/>
                                            <img v-if="project.avatar != 'default.png'" width="50px" height="50px" style="border-radius: 10px;" :src="getUserImagePath(project.avatar)">
                                        </a>
                                    </div>
                                    <div class="col-md-9">
                                        <h5 style="font-size: 16px; color: white;">{{ project.project_name }}</h5>
                                        <a :href="'/user-' + project.creater_id"><h5 class="mb-0" style="margin-top: 2%; font-size: 12px; color: white;"> Created by: {{ project.username }}</h5></a>
                                    </div>
                                </div>
                            </template>
                        </b-card>
                    </a>
                </div>
            </div>
            <div align="center">
                <b-button v-if="projects.length == 16 || page != 1" @click="back()" variant="primary" size="md" class="mb-2" style="margin: 10px;">
                    <b-icon icon="arrow-left-short" aria-hidden="true"></b-icon> Back
                </b-button>

                <b-button v-if="projects.length == 16" @click="next()" variant="primary" size="md" class="mb-2" style="margin: 10px;">
                    Next <b-icon icon="arrow-right-short" aria-hidden="true"></b-icon> 
                </b-button>
            </div>
        </div>
    </div>
</template>

<script>

import UserService from '../services/user.service';
import navbar from './navbar.vue'

export default {
    name: "discover",
    data() {
        return {
            projects: [],
            page: 1
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
    methods: {
        getUserImagePath(photo) {
            return require('../assets/images/avatars/' + photo);
        },

        getThumbImagePath(photo) {
            return require('../assets/images/thumbs/' + photo);
        },
        next() {

            this.page += 1;

            UserService.getCommunityProjects(this.page).then(response => {
                if(!response.data.projects) {
                    this.projects = [];
                } else {
                    this.projects = response.data.projects;
                }
            });
        }, 
        back() {

            this.page -= 1;

            UserService.getCommunityProjects(this.page).then(response => {
                if(!response.data.projects) {
                    this.projects = [];
                } else {
                    this.projects = response.data.projects;
                }            
            });
        }
    },
    beforeMount() {

        UserService.getCommunityProjects(this.page).then(response => {
            if(!response.data.projects) {
                    this.projects = [];
                } else {
                    this.projects = response.data.projects;
            }
        });
    }
}

</script>

<style scoped>

    p {
        color: black;
    }

    .container {
        margin-top: 1% !important;
    }

    .projects {
        margin-top: 5%;
    }

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