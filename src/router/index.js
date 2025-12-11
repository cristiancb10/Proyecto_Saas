import { createRouter, createWebHistory } from 'vue-router';
import pb from '../lib/pb'

import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Tasks from '../pages/Tasks.vue';
import Profile from '../pages/Profile.vue';

// Se crean las rutas
const routes = [
    { path: '/login', component: Login },
    { path: '/register', component: Register },
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

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Middleware de errores de autenticación
router.beforeEach((to, from, next) => {
    const user = pb.authStore.model;

    if (to.meta.requiresAuth && (!user || !pb.authStore.isValid)) {
        next('/login');
    } else {
        next();
    }
});

export default router;