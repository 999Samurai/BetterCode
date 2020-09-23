<template>
  <div class="footer">
    <div class="hr"></div>
    <div class="container">
      <p>
        <span>
          <strong>© 2020 BetterCode</strong>
        </span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
    name: "footer", 
    data(){
        return {}
    }
}
</script>

<style scoped>
  .footer {
    margin-bottom: 3em;
  }

  #footer .icon {
    height: 23px;
    display: inline-block;
    margin-bottom: -6px;
  }

  .hr {
    border-bottom: 1px solid #dbdbdb;
    margin: 3em 0;
  }

  #footer p {
    font-size: 15px;
    color: #fff !important;
  }

  p {
        text-align: center;
        color: #fff !important;
  }

</style>