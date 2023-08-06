import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import routes from './routes/routes';
import PrimeVueComponents from './components/PrimeVueComponents';
import UserComponents from './components/UI';
import FocusTrap from 'primevue/focustrap';
import { createPinia } from 'pinia'
import Ripple from 'primevue/ripple';
import ToastService from 'primevue/toastservice';

import "primevue/resources/themes/lara-light-indigo/theme.css";     
import "primevue/resources/primevue.min.css";
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const app = createApp(App)

PrimeVueComponents.forEach(comp => {
    app.component(comp.name, comp)
})
UserComponents.forEach(comp => {
    app.component(comp.name, comp)
})

app.directive('focustrap', FocusTrap);
app.directive('ripple', Ripple);


// записать сюда все роуты
// app.config.globalProperties

//обработчик ошибок во всех дочерних компонентах приложения
// app.config.errorHandler = (err) => {
//     debugger
//     alert(err.message)
//   }

const pinia = createPinia()
app
    .use(routes)
    .use(PrimeVue, { ripple: true })
    .use(ToastService)
    .use(pinia)
    .mount('#app')
