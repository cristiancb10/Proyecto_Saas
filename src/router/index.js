import { createRouter, createWebHistory } from 'vue-router';
import pb from '../lib/pb'

import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Tasks from '../pages/Tasks.vue';
import ResetPassword from '../pages/ResetPassword.vue';
import Profile from '../pages/Profile.vue';

// Se crean las rutas
const routes = [
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/reset', component: ResetPassword },
    { 
        path: '/tasks', 
        component: Tasks,
        meta: { requiresAuth: true }
    },
    {
        path: "/profile",
        component: Profile,
        meta: { requiresAuth: true }
    },
    { path: '/:pathMatch(.*)*', redirect: '/login' }
];

// Crear la instancia del router de Vue
const router = createRouter({
    history: createWebHistory(), // Historial basado en el API de historial del navegador
    routes     // Definición de rutas de la aplicación
});

// Middleware de errores de autenticación
router.beforeEach((to, from, next) => {
    // Obtiene al usuario actual desde PocketBase authStore
    const user = pb.authStore.model;
    // Si la ruta requiere autenticación y no hay usuario válido
    if (to.meta.requiresAuth && (!user || !pb.authStore.isValid)) {
        // devuelve al login
        next('/login');
    } else {
        // Si el usuario está autenticado o la ruta no requiere login, continuar normalmente
        next();
    }
});

export default router;