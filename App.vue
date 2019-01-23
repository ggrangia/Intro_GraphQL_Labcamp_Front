<template>
  <div id="app">
    <div class="logo">
      <img src="./assets/logo.png" height="250" width="250">
    </div>

    <form @submit.prevent="addMsg">
      <input v-model="msg_name" placeholder="Your name" autocomplete="off">
      <input v-model="msg_text" placeholder="Your Message" autocomplete="off">
      <input type="submit" value="Submit">
    </form>
    <br>
    <button v-on:click="refresh_query()">Refresh Query</button>

    <h1>GraphQL Labcamp Pinboard</h1>
    <div v-for="m in messages">
      <div class="panel panel-default">
        <p>
          <b>{{m.name}}:</b>
          <code>{{m.text}}</code>
          <br>
          <code>
            <b>ID:</b>
            {{m.id}}
          </code>
        </p>
        <hr style="border-color:blue;">
      </div>
    </div>
  </div>
  <!-- end single element -->
</template>

<script>
import gql from "graphql-tag";



export default {
  name: "app",
  data() {
    return {
      newTag: null,
      msg_text: null,
      msg_name: null,
      skipQuery: false,
      messages: []
    };
  },
  apollo: {
    // binds to 'messages' data property on vue instance
    messages: {
      query: gql`
      query{
        query_name {
          field1
          field2
          fieldN
        }
      }
      `,
      subscribeToMore: {
        document: gql`
           subscription {
            subscription_name {
              field1
              field2
              fieldN
            }
          }
        `,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let new_msg = subscriptionData.data.msgAdded;
          if (new_msg.text && new_msg.name) {
            previousResult.messages.unshift(new_msg);
            this.messages = previousResult.messages;
          }
        }
      }
    }
  },

  methods: {
    addMsg() {
      if (!this.msg_name || !this.msg_text) {
        alert("Name and message fields must be filled :)");
        return;
      }
      const txt = this.msg_text;
      this.msg_text = null;
      this.$apollo.mutate({
        mutation: gql`
          mutation($name: String!, $text: String!) {
            mutation_name(name: $name, text: $text) {
              field1
              field2
              fieldN
            }
          }
        `,
        // Parameters
        variables: {
          name: this.msg_name,
          text: txt
        }
      });
    },
    refresh_query() {
      // Perform a new query by clearing the store for this compoment (extreme case)
      this.$apollo.provider.defaultClient.resetStore();
    }
  }
};
</script>

<style>
button,
body,
input {
  font-family: Helvetica, sans-serif;
  font-size: 12pt;
}

#app {
  max-width: 500px;
  padding: 12px;
  margin: auto;
  text-align: center;
}

button,
input {
  padding: 8px;
  border: solid 1px #bbb;
  border-radius: 2px;
}

input:focus {
  box-shadow: none;
  outline: none;
  border-color: #40b883;
}
</style>
