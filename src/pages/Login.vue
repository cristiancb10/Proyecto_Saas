<script setup>
import { useRouter } from 'vue-router';
import pb from '../lib/pb'
import { ref } from 'vue';

const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMsg = ref('');

const loginUser = async () => {
    errorMsg.value = ''; // Limpiar mensajes de error anteriores
    try {
        loading.value = true; // Activar estado de "cargando" 
        // Autenticar el usuario con PocketBase con authWithPassword() se hace una 
        // petición POST a /api/collections/users/auth-with-password
        // authData contiene: { token, record (user), meta }
        // y esto guarda el token en pb.authStore
        const authData = await pb.collection('users').authWithPassword(email.value, password.value);

        // Verifica si el token JWT es válido (isValid) y email verificado? (model.verified)
        if (!pb.authStore.isValid || !pb.authStore.model.verified) {
            errorMsg.value = 'Tu cuenta no esta verificada. Revisa tu correo.';
            pb.authStore.clear(); // Limpiar la sesion si no esta verificada (remueve el token)
            return;
        }

        // Redirigir al Tasks
        router.push('/tasks');
    } catch (err) {
        errorMsg.value = 'Email o contraseña incorrectos.';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div class="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        
            <h1 class="text-2xl font-bold mb-4 text-center text-white">Iniciar sesión</h1>

            <form @submit.prevent="loginUser" class="space-y-4">

                <!-- Email -->
                <div>
                    <label class="block font-semibold mb-1 text-gray-300">Email:</label>
                    <input
                        v-model="email"
                        type="email"
                        class="w-full border border-gray-600 bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <!-- Password -->
                <div>
                    <label class="block font-semibold mb-1 text-gray-300">Contraseña:</label>
                    <input
                        v-model="password"
                        type="password"
                        class="w-full border border-gray-600 bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <!-- Iniciar sesion -->
                <button
                    type="submit"
                    :disabled="loading"
                    class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                >
                {{ loading ? 'Iniciando...' : 'Iniciar sesión' }}
                </button>

                <p v-if="errorMsg" class="text-red-400 font-bold text-base mt-2 text-center">
                    {{ errorMsg }}
                </p>
            </form>

            <!-- Ir a registro -->
            <p class="text-center mt-4 text-gray-300">
                ¿No tienes una cuenta?
                <a href="/register" class="text-blue-400 font-medium hover:underline">
                Registrarse
                </a>
            </p>

            <!-- Recuperar contraseña -->
            <p class="mt-3 text-center">
                <a href="/reset" class="text-blue-400 text-base hover:underline">
                ¿Olvidaste tu contraseña?
                </a>
            </p>
        </div>
    </div>
</template>
