<template>
  
  <div>
    
    <navbar v-if="currentUser" :loggedin="true" :currentUser="currentUser"/>

    <div class="row" style="margin-top: 5%">
        <h2 style="color: white;" id="publicprofile">Plans</h2>
        <hr style="color: #161B22; width: 100%; color: white; border-bottom: 1px solid #261B22;">

        <section id="pricing">
            <b-alert show dismissible variant="success" v-if="success" align="center">You successfully bought your plan.</b-alert>
            <b-row>
                <b-col cols="4" data-aos="zoom-in">
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
                        
                        <b-button href="#" variant="primary" id="paypal-button" :disabled="true">Free</b-button>
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

                        <paypal     
                            amount="5.00"
                            locale="pt_PT"
                            currency="EUR"
                            env="sandbox"
                            :button-style="myStyle"
                            :client="paypal"
                            @payment-completed="orderCompleted"
                        ></paypal>
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

                        <paypal     
                            amount="15.00"
                            locale="pt_PT"
                            currency="EUR"
                            env="sandbox"
                            :button-style="myStyle"
                            :client="paypal"
                            @payment-completed="orderCompleted"
                        ></paypal>
                    </b-card>
                </b-col>
            </b-row>
        </section>  
    </div>   
  </div>

</template>

<script>

import navbar from './navbar.vue'
import paypal from 'vue-paypal-checkout'
import UserService from '../services/user.service';

export default {
    data() {
        return {
            success: false,
            plan: 0,
            paypal: {
                sandbox: 'AQaTP-FxfrZ7ZJghB5oUH2U9ihN3bCLHfQ77-S8bPaQHzKqiG6GzyPAJNb7OKO8BqSLDuGTqLaYFKKFw'
            },
            myStyle: {
                label: 'checkout',
                size:  'responsive',
                shape: 'pill',
                color: 'gold'
            }  
        }
    }, components: { navbar, paypal },
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        }
    },
    methods: {
        getImagePath(photo) {
            return require('../assets/images/avatars/' + photo);
        },
        getPlanId(total) {
            if(total == "5.00") {
                return 1;
            }
            if(total == "15.00") {
                return 2;
            }
        },
        orderCompleted(e) {
        
            let total = e.transactions[0].amount.total;
            let planId = this.getPlanId(total);
            let paymentId = e.id;
            let state = e.state;

            UserService.updateUserPlan(planId, paymentId, state).then(res => {
                if(res.data.success == true) {
                    this.success = true;

                    let userObject = JSON.parse(localStorage.getItem('user'));
                    userObject.planId = planId;
                    localStorage.setItem('user', JSON.stringify(userObject));
                    setTimeout(function() { location.reload() }, 2000);
                }
            })
        }
    }
}

</script>

<style scoped>

#paypal-button {
    display: flex; 
    justify-content: center;
}

.na {
    color:red;
}
</style>