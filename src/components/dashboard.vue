<template>

    <div>

        <navbar v-if="loggedIn" :loggedin="true" :currentUser="currentUser"/>
        
        <div class="container">
        
            <span id="disabled-wrapper" class="d-inline-block" tabindex="0" style="float: right;">
                <b-button variant="primary" size="md" v-b-modal.modal-prevent-closing class="mb-2" :disabled=disabled>
                    <b-icon icon="plus" aria-hidden="true"></b-icon>New Project  
                </b-button>
            </span>

            <b-tooltip v-if="disabled" target="disabled-wrapper" placement="left">
                You can't create more projects, upgrade your plan.
            </b-tooltip>

            <b-modal
            id="modal-prevent-closing"
            ref="modal" 
            title="Create new project"
            @show="resetModal"
            @hidden="resetModal"
            @ok="handleCreate"
            >
                <form ref="form" @submit.stop.prevent="handleSubmit">
                    <b-form-group
                    label="Project Name"
                    label-for="project_name"
                    invalid-feedback="Project name is required with at least 3 digits."
                    >
                    <b-form-input
                        id="project_name"
                        v-model="name"
                        :state="nameState"
                        v-validate="'required|min:3|max:20'"
                        required
                    ></b-form-input>
                    </b-form-group>
                </form>
            </b-modal>

            <div style="clear: both;"></div>
            <div class="projects">
                <div class="row">
                    <p align="center" v-if="projects.length == 0">You don't have any projects.</p>

                    <div v-for="project in projects" v-bind:key="project.id">
                        <a :href="'/pen/' + project.id">
                            <b-card
                            no-body
                            img-height="125px"
                            bg-variant="dark"
                            style="width: 16rem; margin: 10px; color: white;"
                            v-bind:img-src="getImagePath(project.project_thumb)"
                            img-alt="Project Image"
                            img-top
                            >
                                <template #header>
                                    <h5 class="mb-0">{{ project.project_name }}</h5>
                                </template>
                            </b-card>
                        </a>
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
            name: '',
            disabled: false,
            successful: false,
            projects: []
        }
    },
    computed: {
        
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
        currentUser() {
            return this.$store.state.auth.user;
        }, 
        nameState() {
            return this.name.length > 2 ? true : false
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

            UserService.createProject(this.name).then(response => {
                if(response.data.success == true) {

                    this.projects.push(response.data.project[0])
                    this.successful = true;

                } else {

                    this.successful = false;

                }
            })

            if(this.projects.length == 5 && this.currentUser.planId == 0) { this.disabled = true; }
            else if(this.projects.length == 15 && this.currentUser.planId == 1) { this.disabled = true; }

        },
            
        resetModal() {
            this.name = ''
            this.nameState = null
        },

        getImagePath(photo) {
            return require('../assets/images/thumbs/' + photo);
        }

    },
    async beforeMount() {
        
        await UserService.getUserProjects().then(response => {

            if(response.data.auth == true) {

                this.projects = response.data.projects;

            } else if (response.data.auth == false){ 
                // Expired or invalid token
                this.$router.push('/logout');
            }
        });

        if(this.projects.length == 5 && this.currentUser.planId == 0) { this.disabled = true; }
        else if(this.projects.length == 15 && this.currentUser.planId == 1) { this.disabled = true; }

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