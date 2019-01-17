import Vue from 'vue'
import VueApollo from 'vue-apollo'
import {
  ApolloClient
} from 'apollo-client'
import {
  HttpLink
} from 'apollo-link-http'
import {
  InMemoryCache
} from 'apollo-cache-inmemory'
import {
  WebSocketLink,
} from 'apollo-link-ws'
import {
  SubscriptionClient
} from 'subscriptions-transport-ws';
import {
  split
} from 'apollo-link'
import {
  getMainDefinition
} from 'apollo-utilities'

const httpLink = new HttpLink({
  // You should use an absolute URL here
  //uri: 'http://localhost:3020/graphql',
  uri: 'http://34.241.195.97:3020/graphql'
})

const wsLink = new WebSocketLink({
  //uri: 'ws://localhost:3020/graphql',
  uri: 'ws://34.241.195.97:3020/graphql',
  options: {
    reconnect: true,
  },
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({
    query
  }) => {
    const {
      kind,
      operation
    } = getMainDefinition(query)
    return kind === 'OperationDefinition' &&
      operation === 'subscription'
  },
  wsLink,
  httpLink
)

// Create the apollo client
const apolloClient = new ApolloClient({
  link,
  connectToDevTools: true,
  cache: new InMemoryCache()
});

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

import App from './App.vue';

const vm = new Vue({
  el: '#app',
  apolloProvider,
  render: h => h(App),
})

// Listener on subscription reconnect event
wsLink.subscriptionClient.onReconnected(() => {
  vm.$children[0].refresh_query();
});