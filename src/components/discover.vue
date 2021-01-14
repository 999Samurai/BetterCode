<template>
    <div>
        <navbar :loggedin="true" v-bind:username="currentUser.username" :avatar="currentUser.avatar"/>    

        <div class="projects">
            <div class="row justify-content-center">
                <p align="center" v-if="projects.length == 0">You don't have any projects.</p>

                <div v-for="project in projects" v-bind:key="project.id">
                    <a :href="'/pen/' + project.id">
                        <b-card
                        no-body
                        img-height="125px"
                        style="width: 16rem; margin: 10px;"
                        v-bind:img-src="getThumbImagePath(project.project_thumb)"
                        img-alt="Project Image"
                        img-top
                        >
                            <template #header style="align-content: center;">
                                <img align="left" width="50px" height="50px" style="margin-right: 5px" :src="getUserImagePath(project.avatar)">
                                <h5 style="font-size: 16px;">{{ project.project_name }}</h5>
                                <h5 class="mb-0" style="margin-top: 2%; font-size: 12px;">Created by: {{ project.username }}</h5>
                                <div style="clear: both;"></div>
                            </template>
                        </b-card>
                    </a>
                </div>
                <b-button variant="primary" size="md" class="mb-2" style="margin: 10px;">
                    <b-icon icon="plus" aria-hidden="true"></b-icon>Previous
                </b-button>

                <b-button variant="primary" size="md" class="mb-2" style="margin: 10px;">
                    <b-icon icon="plus" aria-hidden="true"></b-icon>Next  
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
        }
    },
    beforeMount() {

        UserService.getCommunityProjects(this.page).then(response => {
            this.projects = response.data.projects;
            console.log(this.projects);
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