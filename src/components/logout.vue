<template>

    <h1>You are logged out.</h1>

</template>

<script>

    export default {
        beforeCreate() {
            this.$store.dispatch('auth/logout');
            this.$router.push('/login');
        }
    }

</script>