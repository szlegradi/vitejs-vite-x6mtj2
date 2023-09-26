import Vue from 'vue';
import './style.css';
import App from './App.vue';

const app = new Vue({
  render: (h) => h(App),
});

console.log(app);

app.$mount('#app');
