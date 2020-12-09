<template>

    <div>

        <navbar :loggedin="true" v-bind:username="currentUser.username"/>
        
        <div class="container">
        
            <b-button variant="primary" size="md" v-b-modal.modal-prevent-closing class="mb-2" style="float: right;">
                <b-icon icon="plus" aria-hidden="true"></b-icon>New Project  
            </b-button>

            <b-modal
            id="modal-prevent-closing"
            ref="modal" 
            title="Create new project"
            @ok="handleCreate"
            >
                <form ref="form" @submit.stop.prevent="handleSubmit">
                    <b-form-group
                    :state="nameState"
                    label="Project Name"
                    label-for="project_name"
                    invalid-feedback="Project name is required"
                    >
                    <b-form-input
                        id="project_name"
                        v-validate="'required|min:3|max:20'"
                        v-model="name"
                        :state="nameState"
                        required
                    ></b-form-input>
                    </b-form-group>
                </form>
            </b-modal>

            <div style="clear: both;"></div>

            <div class="projects">
                <div class="row mt-5 justify-content-center">
                    <p align="center" v-if="projects.length == 0">You don't have any projects.</p>

                    <div v-for="project in projects" v-bind:key="project.id">
                        <b-card
                        no-body
                        style="width: 15rem; margin: 10px;"
                        v-bind:img-src="getImagePath(project.project_thumb)"
                        img-alt="Project Image"
                        img-top
                        >

                            <template #header>
                                <h4 class="mb-0">{{ project.project_name }}</h4>
                            </template>
                        </b-card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import UserService from '../services/user.service';
import navbar from './navbar.vue'

export default {
    name: "dashboard",
    data() {
        return {
            successful: false,
            projects: []
        }
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        }
    },
    components: {
        navbar
    },
    methods: {
        
        handleCreate() {
            this.$validator.validate().then(isValid => {
                if (!isValid) {
                    this.successful = false;
                    return;
                }
            });

            let name = document.getElementById("project_name").value

            UserService.CreateProject(name).then(response => {

                if(response.data.success == true) {

                    this.projects.push(response.data.project[0])
                    this.successful = true;

                } else {

                    this.successful = false;

                }

            })
        },

        getImagePath(photo) {
            return require('../assets/images/thumbs/' + photo);
        }

    },
    beforeMount() {
        UserService.getUserProjects().then(response => {

            if(response.data.auth == true) {

                this.projects = response.data.projects;

            } else if (response.data.auth == false){ // Expired or invalid token

                this.$router.push('/logout');

            }

            console.log(this.projects);

        });
    }
}

</script>

<style scoped>

    p {
        color: white;
    }

    .container {
        margin-top: 1% !important;
    }

    .projects {
        margin-top: 5%;
    }

</style>