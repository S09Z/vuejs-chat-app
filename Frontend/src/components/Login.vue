<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username">
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password">
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import jwt_decode from 'jwt-decode';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('/api/login', {
          username: this.username,
          password: this.password,
        });
        const token = response.data.token;
        const user = jwt_decode(token);
        this.$store.commit('setUser', user);
        localStorage.setItem('token', token);
        this.$router.push('/');
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
  },
};
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}
label {
  display: block;
  margin-bottom: 0.5em;
}
input {
  padding: 0.5em;
  margin-bottom: 1em;
}
button {
  padding: 0.5em 1em;
  border: none;
  background-color: #3498db;
  color: #fff;
  cursor: pointer;
}
button:hover {
  background-color: #2980b9;
}
p {
  color: red;
}
</style>
