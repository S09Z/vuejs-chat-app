<template>
  <div class="group-chat">
    <h2>Create a new group chat</h2>
    <form @submit.prevent="createGroupChat">
      <div class="form-group">
        <label for="group-name">Group name</label>
        <input id="group-name" type="text" v-model="groupName" required />
      </div>
      <div class="form-group">
        <label for="group-members">Select members</label>
        <multiselect
          v-model="selectedContacts"
          :options="contacts"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="true"
          placeholder="Search members..."
        >
          <template slot="singleLabel" slot-scope="{ option }">{{
            option.name
          }}</template>
          <template slot="option" slot-scope="{ option }">{{
            option.name
          }}</template>
        </multiselect>
      </div>
      <button type="submit">Create</button>
    </form>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';
import Multiselect from 'vue-multiselect';

export default {
  name: 'GroupChat',
  components: {
    Multiselect,
  },
  data() {
    return {
      groupName: '',
      selectedContacts: [],
      contacts: [],
    };
  },
  computed: {
    ...mapGetters(['getUserById', 'getContacts']),
  },
  created() {
    this.contacts = this.getContacts.filter((contact) => contact.id !== this.$store.state.currentUser.id);
  },
  methods: {
    createGroupChat() {
      // TODO: Implement group chat creation
    },
  },
};
</script>

<style scoped>
.group-chat {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  color: #333;
  padding: 1em;
}

.group-chat h2 {
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 0.5em;
}

.group-chat form {
  width: 100%;
  max-width: 400px;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.group-chat .form-group {
  margin-bottom: 1em;
}

.group-chat label {
  display: block;
  font-weight: bold;
}

.group-chat input[type="text"],
.group-chat .multiselect__input {
  width: 100%;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;
  line-height: 1.5;
}

.group-chat button[type="submit"] {
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5em 1em;
  cursor: pointer;
}
</style>
