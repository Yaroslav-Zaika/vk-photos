<template>
  <div id="app" class="container">
    <header>
      <div class="logo">
       <router-link class="link" to="/">VK-Vue</router-link>
      </div>
      <form @submit.prevent v-if="form && auth">
        <input class="input-search" type="text" @keyup.enter="search(value)" v-model="value">
        <input class="button" type="button" @click.prevent="search(value)" value="Поиск">
        <input class="button" type="button" @click.prevent="clean()" value="Очистить">
      </form>
      <div class="clear"></div>
    </header>
    <div class="button-box" v-if="!auth">
      <input class="button button-login" type="button" @click.prevent="authLogin()" value="Войти">
    </div>
    <router-view :auth="auth"></router-view>
  </div>
</template>

<script>
  import MugenScroll from 'vue-mugen-scroll'

  export default {

    components:{
      MugenScroll
    },

    data () {
      return {
        auth: false,
        settings: '77732',
        value: '',
        countAll: 0,
        offset: 0,
        countSearch: 30,
        form: true
      }
    },

    methods: {

      authLogin () {
        
        VK.Auth.login(response => {
          if (response.session) {
            this.auth = true;
          } else {
            setTimeout(() => {
              this.authLogin();
            }, 2000);
          };
        }, this.settings);
        
      },

      clean () {
        this.$root.$emit('clean');
      },

      search (value) {
        
        if (this.auth) {
          this.$root.$emit('search', value);
        }
        
      },

      router () {
        
        if (this.$route.path !== '/') {
          this.form = false;
        } else {
          this.form = true;
        }
        
      }

    },

    watch: {

     '$route' () {
       this.router();
     }

    },

    created () {

      this.router();

      VK.init({
        apiId: 5814740
      });
      
    }

  }
</script>

<style lang="scss">
  
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    background: #edeef0;
  }
  
  a {
    text-decoration: none;
    color: #2a5885;
  }

  a:hover { 
    text-decoration: underline;
  }

  .container {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #2c3e50;
    margin: 0 auto;
    height: 100%;
    min-height: 100px;
	width: 100%;
    
    header {
      height: 42px;
      background: #507299;
      
      .logo {
        width: 10%;
        min-width: 70px;
        float: left;
        margin: 8px 10px 0;
        font-weight: 900;
        cursor: pointer;
        }

      .link {
        color: #fff;
        text-decoration: none;
      }

      form {
        text-align: center;
        width: 90%;
        
        .input-search {
          border: 0;
          box-sizing: border-box;
          padding: 6px 6px 6px 19px;
          margin: 7px 0;
          height: 28px;
          line-height: 16px;
          width: 230px;
          border-radius: 14px;
          background: #305075 url(./img/dev_head_magglass.png) no-repeat;
          padding-left: 19px;
          border-left: 8px solid transparent;
          background-position: left 8px;
          color: #d9e2ec;
          outline: none;
        }

        .input-search:focus {
          background-color: #fff;
          color: #000;
        }
      }
    }
    
    .button {
      padding: 7px 16px 8px;
      margin-top: 5px;
      font-size: 12.5px;
      cursor: pointer;
      outline: none;
      font-family: -apple-system,BlinkMacSystemFont,Roboto,Open Sans,Helvetica Neue,sans-serif;
      vertical-align: top;
      line-height: 15px;
      text-align: center;
      text-decoration: none;
      background: none;
      background-color: #5e81a8;
      color: #fff;
      border: 0;
      border-radius: 2px;
      box-sizing: border-box;
    }
    
    .button-box {
      height: 90%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .button-login {
        font-size: 13.5px;
        padding: 10px 30px;
        line-height: 25px;
        border-radius: 25px;
      }
    }
    
    .center {
      text-align: center;
    }
    
    .clear {
      clear: both;
    }
  }
  
  @media screen and (max-width: 660px) {
    
    .container {
      
      header {
        height: auto;
        
        .logo {
          width: 90%;
          margin: 3px 0 5px;
          padding-left: 15px;
        }

        form {
          width: 100%;
          
          .input-search {
            width: 40%;
          }
        }
      }
    }
    
  }
  
</style>
