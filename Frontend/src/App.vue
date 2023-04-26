<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/group-chat">Create group chat</router-link>
      <button v-if="currentUser" @click="logout">Logout</button>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapGetters(['currentUser']),
  },
  methods: {
    ...mapActions(['logout']),
  },
};
</script>
