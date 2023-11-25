import 'primeicons/primeicons.css';
import 'primevue/resources/themes/lara-light-purple/theme.css';
import 'primeflex/primeflex.css';
import './assets/overrides.css';
import './assets/core.css';
import './assets/style.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';

import App from './App.vue';
import router from './router';
import {useSessionStore} from '@/stores/SessionStore';
import GroupService from './service/GroupService';
import HeartbeatService from './service/HeartbeatService';

async function initialise(){
    const store = useSessionStore();

    store.groups = await GroupService.getGroups();
    if(store.groups.length > 0){
        store.currentGroup = store.groups[0];
    }

    HeartbeatService.start();

    app.mount('#app');
}

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue);
app.config.globalProperties.window = window;

initialise();
