import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { createAppI18n } from './i18n';
import './assets/main.css';

createApp(App).use(createPinia()).use(createAppI18n()).mount('#app');
