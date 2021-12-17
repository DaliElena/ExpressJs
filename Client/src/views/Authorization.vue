<template>
  <div class="main-block">
    <div class="main">
      <input type="checkbox" id="chk" :checked="isLoginPage" aria-hidden="true">

      <div class="signup">
        <form @submit.prevent>
          <label for="chk" aria-hidden="true">Регистрация</label>
          <input v-model="login" type="text" name="txt" placeholder="Имя пользователя" required="">
          <input v-model="password" type="password" name="pswd" placeholder="Пароль" required="">
          <button @click="register">Зарегистрироваться</button>
        </form>
      </div>

      <div class="login">
        <form @submit.prevent>
          <label for="chk" aria-hidden="true">Вход</label>
          <input v-model="login" type="text" name="txt" placeholder="Имя пользователя" required="">
          <input v-model="password" type="password" name="pswd" placeholder="Пароль" required="">
          <button @click="signIn">Войти</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

import Swal from 'sweetalert2';

export default {
  name: 'Authorization',

  components: {},

  data() {
    return {
      login: null,
      password: null,
      isLoginPage: false,
    };
  },

  computed: {},

  watch: {},

  created() {
  },

  mounted() {
  },

  methods: {
    register() {
      if (!this.login || !this.password) {
        this.showErrorMessage('Введите логин и пароль');
        return;
      }
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      const raw = JSON.stringify({username: this.login, password: this.password});
      const requestOptions = {
        method: 'POST',
        body: raw,
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch(`${process.env.VUE_APP_ROOT_API}/auth/registration`, requestOptions)
          .then(response => response.text())
          .then(result => {
            const response = JSON.parse(result);
            if (response.message === 'Пользователь успешно зарегистрирован') {
              console.log('!!!!');
              this.login = '';
              this.password = '';
              this.isLoginPage = true;
            } else if (response.errors) {
              this.showErrorMessage(response?.errors?.errors[0].msg);
            } else {
              this.showErrorMessage(response.message);
            }
            console.log(result);
          })
          .catch(error => console.log('error', error));
    },
    signIn() {
      if (!this.login || !this.password) {
        this.showErrorMessage('Введите логин и пароль');
        return;
      }
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      const raw = JSON.stringify({username: this.login, password: this.password});
      const requestOptions = {
        method: 'POST',
        body: raw,
        headers: myHeaders,
        redirect: 'follow',
      };
      fetch(`${process.env.VUE_APP_ROOT_API}/auth/login`, requestOptions)
          .then(response => response.text())
          .then(result => {
            const response = JSON.parse(result);
            if (response.token) {
              localStorage.setItem('token', response.token);
              this.$router.push('/');
            } else {
              this.showErrorMessage(response.message);
            }
            console.log(result);
          })
          .catch(error => console.log('error', error));
    },
    showErrorMessage(message) {
      Swal.fire({
        icon: 'error',
        title: 'Ошибка',
        text: message || 'Что-то пошло не так :(',
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.main-block {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Jost', sans-serif;
  background: linear-gradient(to bottom, #90f3e9, #2f7ff3, #4777ff);
}

.main {
  width: 350px;
  height: 500px;
  background: red;
  overflow: hidden;
  background: url("https://doc-08-2c-docs.googleusercontent.com/docs/securesc/68c90smiglihng9534mvqmq1946dmis5/fo0picsp1nhiucmc0l25s29respgpr4j/1631524275000/03522360960922298374/03522360960922298374/1Sx0jhdpEpnNIydS4rnN4kHSJtU1EyWka?e=view&authuser=0&nonce=gcrocepgbb17m&user=03522360960922298374&hash=tfhgbs86ka6divo3llbvp93mg4csvb38") no-repeat center/ cover;
  border-radius: 10px;
  box-shadow: 5px 20px 50px #000;
}

#chk {
  display: none;
}

.signup {
  position: relative;
  width: 100%;
  height: 100%;
}

label {
  color: #fff;
  font-size: 2.3em;
  justify-content: center;
  display: flex;
  margin: 60px;
  font-weight: bold;
  cursor: pointer;
  transition: .5s ease-in-out;
}

input {
  width: 60%;
  height: 20px;
  background: #e0dede;
  justify-content: center;
  display: flex;
  margin: 20px auto;
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 5px;
}

button {
  width: 60%;
  height: 40px;
  margin: 10px auto;
  justify-content: center;
  display: block;
  color: #fff;
  background: #b19927;
  font-size: 1em;
  font-weight: bold;
  margin-top: 20px;
  outline: none;
  border: none;
  border-radius: 5px;
  transition: .2s ease-in;
  cursor: pointer;
}

button:hover {
  background: #6d44b8;
}

.login {
  height: 460px;
  background: #eee;
  border-radius: 60% / 10%;
  transform: translateY(-180px);
  transition: .8s ease-in-out;
}

.login label {
  color: #573b8a;
  transform: scale(.6);
}

#chk:checked ~ .login {
  transform: translateY(-500px);
}

#chk:checked ~ .login label {
  transform: scale(1);
}

#chk:checked ~ .signup label {
  transform: scale(.6);
}

</style>
