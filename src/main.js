import { createApp } from 'vue' // Importa el componente para instaciar apllicacion VUE
import App from './App.vue' // Importa el componente raiz "App"
import router from './router' // Importa el enrutador para manejar paginas
import './main.css';

createApp(App) // Crea un instancia de aplicacion VUE 
    .use(router) // Instala el plugin router
    .mount('#app') // Monta la aplicacion VUE en el DOM (id=app ubicado en index.html)