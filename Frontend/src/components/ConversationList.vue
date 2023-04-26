<template>
  <div class="conversation-list">
    <h2>Conversations</h2>
    <ul>
      <li v-for="user in users" :key="user.id" @click="openChat(user)">
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ConversationList',
  data() {
    return {
      users: [],
    };
  },
  created() {
    this.loadUsers();
  },
  methods: {
    async loadUsers() {
      try {
        const response = await axios.get('/api/users');
        this.users = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    openChat(user) {
      this.$router.push({ name: 'ChatWindow', params: { userId: user.id } });
    },
  },
};
</script>

<style scoped>
.conversation-list {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  display: block;
  margin-bottom: 0.5em;
  cursor: pointer;
}
li:hover {
  background-color: #f2f2f2;
}
</style>
