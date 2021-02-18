<script>
export default {
    async created() {
        
        let user = {};

        user["auth"] = this.$route.query.auth;
        user["user_id"] = this.$route.query.user_id;
        user["user_email"] = this.$route.query.user_email;
        user["username"] = this.$route.query.username;
        user["avatar"] = this.$route.query.avatar;
        user["planId"] = this.$route.query.planId;

        await localStorage.setItem('user', JSON.stringify(user));
        location.href = '/dashboard';

    }
}
</script>