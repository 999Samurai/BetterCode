<template>
    <div>
        <navbar v-if="currentUser" :loggedin="true" v-bind:username="currentUser.username" :avatar="currentUser.avatar" :userId="currentUser.user_id"/>

        <br><br>

        <b-alert show dismissible variant="success" v-if="this.status == 'email_verified'" align="center">The email has been verified. You can now Login.</b-alert>
        <b-alert show dismissible variant="warning" v-if="this.status == 'error_email'" align="center">Failed to verify the email.</b-alert>

        <!-- Apresentation Section -->

        <section>
            <b-container class="bv-example-row">
                <b-row>
                    <b-col cols="6" data-aos="fade-right" data-aos-duration="500">
                        <h1 class="text-justify" id="h1-main-text">Develop anywhere at any time</h1>
                        <h2 class="text-justify" id="h2-main-text">With <b>BetterCode</b> you can enjoy and develop online projects at the frontend level</h2>
                        <b-button variant="outline-warning" href="#pricing">Get Started</b-button>                
                    </b-col>
                    <b-col cols="6">
                        <img src="../assets/images/CodeBetter-hero.png" width="400" class="img-fluid" alt="BetterCodeImage" data-aos="fade-left" data-aos-duration="500" id="img-main-text">
                    </b-col>
                </b-row>
            </b-container>
        </section>

        <!-- *** -->

        <!-- Services Section -->

        <section>
            <b-container class="bv-example-row">
                <div class="section-title">
                    <h2 data-aos="fade-in" data-aos-duration="1000">Services</h2>
                    <p data-aos="fade-in" data-aos-duration="1000">Our service offers many features in order to captivate you to use our website</p>
                </div>
                <b-row>
                    <b-col cols="6" data-aos="fade-right" data-aos-duration="1000">
                        <b-card
                            border-variant="primary" header='Store public and private projects' header-bg-variant="primary" header-text-variant="white" align="center">
                            <b-card-text>We want you to access the projects that you have created anywhere in the world.</b-card-text>
                        </b-card>
                    </b-col>
                    <b-col cols="6" data-aos="fade-left" data-aos-duration="1000">
                        <b-card
                            border-variant="primary" header='Develop, edit and observe projects' header-bg-variant="primary" header-text-variant="white" align="center">
                            <b-card-text>With our website you can create projects, edit them, and navigate in the community tab to see what the other users have been published.</b-card-text>
                        </b-card>
                    </b-col>
                </b-row>
                <br><br>
                <b-row>
                    <b-col cols="6" data-aos="fade-right" data-aos-duration="1000">
                        <b-card
                            border-variant="primary" header='Customizable' header-bg-variant="primary" header-text-variant="white" align="center">
                            <b-card-text>Our priority is a better user experience therefore the website is fully customizable.</b-card-text>
                        </b-card>
                    </b-col>
                    <b-col cols="6" data-aos="fade-left" data-aos-duration="1000">
                        <b-card
                            border-variant="primary" header='News and Updates' header-bg-variant="primary" header-text-variant="white" align="center">
                            <b-card-text>We update the user when there are new features so we use a tab for news and updates!</b-card-text>
                        </b-card>
                    </b-col>
                </b-row>
            </b-container>
        </section>

        <!-- *** -->
        <!-- Plans Section -->

        <section id="pricing">
            <b-container class="bv-example-row">
                <div class="section-title">
                    <h2 data-aos="fade-in" data-aos-duration="1000">Pricing</h2>
                    <p data-aos="fade-in" data-aos-duration="1000">We try to be as understandable and inexpensive in relation to our price.</p>
                </div>
            </b-container>
            <b-row>
                <b-col cols="4" data-aos="zoom-in" data-aos-duration="1000">
                    <b-card title="Free" style="max-width: 100%;" class="mb-4">
                        <b-card-text>
                            <h3>0€ - Lifetime</h3>

                            <ul style="list-style-type:none;">
                                <li><b-icon icon="check2" aria-hidden="true"></b-icon> Store Projects to Community</li>
                                <li><b-icon icon="check2" aria-hidden="true"></b-icon> Can create up to 5 projects</li>
                                <li><b-icon icon="check2" aria-hidden="true"></b-icon> Community Access</li>
                                <li><b-icon icon="check2" aria-hidden="true"></b-icon> Total Website Customization</li>
                                <li class="na"><b-icon icon="x" aria-hidden="true"></b-icon> Save projects as private</li>
                                <li class="na"><b-icon icon="x" aria-hidden="true"></b-icon> Access to future exclusives within the website</li>
                            </ul>

                        </b-card-text>

                        <b-button href="#" variant="primary" id="planbutton">Get Started</b-button>
                    </b-card>
                </b-col>
                <b-col cols="4" data-aos="zoom-in" data-aos-duration="1000">
                    <b-card title="Plus" style="max-width: 100%;" class="mb-4">
                        <b-card-text>
                            <h3>5€ - Lifetime</h3>

                            <ul style="list-style-type:none;">
                                <li><b-icon icon="check2" aria-hidden="true"></b-icon> Store Projects to Community</li>
                                <li><b-icon icon="check2" aria-hidden="true"></b-icon> Can create up to 15 projects</li>
                                <li><b-icon icon="check2" aria-hidden="true"></b-icon> Community Access</li>
                                <li><b-icon icon="check2" aria-hidden="true"></b-icon> Total Website Customization</li>
                                <li><b-icon icon="check2" aria-hidden="true"></b-icon> Save projects as private</li>
                                <li class="na"><b-icon icon="x" aria-hidden="true"></b-icon> Access to future exclusives within the website</li>
                            </ul>

                        </b-card-text>

                        <b-button href="#" variant="primary" id="planbutton">Get Started</b-button>
                    </b-card>
                </b-col>
                <b-col cols="4" data-aos="zoom-in" data-aos-duration="1000">
                    <b-card title="Pro" style="max-width: 100%;" class="mb-4">
                        <b-card-text>
                            <h3>15€ - Lifetime</h3>

                            <ul style="list-style-type:none;">
                                <li><b-icon icon="check2" aria-hidden="true"></b-icon> Store Projects to Community</li>
                                <li><b-icon icon="check2" aria-hidden="true"></b-icon> Can create unlimited projects</li>
                                <li><b-icon icon="check2" aria-hidden="true"></b-icon> Community Access</li>
                                <li><b-icon icon="check2" aria-hidden="true"></b-icon> Total Website Customization</li>
                                <li><b-icon icon="check2" aria-hidden="true"></b-icon> Save projects as private</li>
                                <li><b-icon icon="check2" aria-hidden="true"></b-icon> Access to future exclusives within the website</li>
                            </ul>

                        </b-card-text>

                        <b-button href="#" variant="primary" id="planbutton">Get Started</b-button>
                    </b-card>
                </b-col>
            </b-row>
        </section>
        <foot/>
    </div>
</template>
<script>

import navbar from './navbar.vue'
import foot from './footer.vue'
import UserService from '../services/user.service';

export default {
    data() {
        return {
        }
    },
    components: {
        navbar,
        foot
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
        currentUser() {
            if(this.$store.state.auth.status.loggedIn) {
                return this.$store.state.auth.user;
            } else {
                return "";
            }
        }
    },
    props: {
        'status': String
    },
    methods: {},
    mounted: function() {
      this.status = this.$route.query.status;
    },
    beforeMount() {

        if(this.$store.state.auth.status.loggedIn) {
            UserService.getUserProjects().then(response => {

                if (response.data.auth == false) { // Expired or invalid token

                    this.$router.push('/logout');

                }
            });
        }
    }
}
</script>

<style scoped>


#img-main-text {
    padding-left: 5%;
    margin-top: 5%;
    size: 100px;
}

#h1-main-text {
    font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    padding-top: 30%;
    color:white;
    font-size: 41px;
}


#h2-main-text {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    color:gray;
    font-size: 20px;
}

.section-title {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    text-align: center;
    padding-top: 100px;
    color: white;
    font-size: 20px;
}

.na {
    color:red;
}

#planbutton {
    display: flex; 
    justify-content: center;
}

</style>