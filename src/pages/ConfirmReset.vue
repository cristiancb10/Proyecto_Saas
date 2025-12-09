<script setup>
import { useRoute, useRouter } from 'vue-router';
import pb from '../lib/pb.js'
import { ref } from 'vue';

const route = useRoute();
const router = useRouter();

const token = route.query.token;
const password = ref('');
const passwordConfirm = ref('');
const success= ref('');
const error = ref('');

const resetPassword = async () => {
    success.value = '';
    error.value = '';

    if (password.value !== passwordConfirm.value)  {
        error.value = "Las contraseñas no coinciden";
        return;
    }

    try {
        await pb.collection('users').confirmPasswordReset(
            token,
            password.value,
            passwordConfirm.value
        );

        success.value = 'Contraseña actualizada. Ahora puedes iniciar sesión.';

        setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
        error.value = 'No se pudo restablecer la contraseña';
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-900">
        <div class="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">

        <h2 class="text-xl font-bold text-white mb-4">Nueva contraseña</h2>

        <!-- Nueva contraseña -->
        <input
            type="password"
            v-model="password"
            placeholder="Nueva contraseña"
            class="w-full border border-gray-600 bg-gray-700 text-white p-2 rounded mb-2
                focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <!-- Confirmar contraseña -->
        <input
            type="password"
            v-model="passwordConfirm"
            placeholder="Confirmar nueva contraseña"
            class="w-full border border-gray-600 bg-gray-700 text-white p-2 rounded mb-4
                focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <!-- Botón guardar -->
        <button
            @click="resetPassword"
            class="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
        >
            Guardar contraseña
        </button>

        <!-- Mensaje de éxito -->
        <p v-if="success" class="text-green-400 mt-3 text-sm text-center">
            {{ success }}
            <br />
            <button
            @click="router.push('/login')"
            class="text-blue-400 underline mt-2 inline-block hover:text-blue-300"
            >
            Haz click aquí para volver al login
            </button>
        </p>

        <!-- Mensaje error -->
        <p v-if="error" class="text-red-400 mt-3 text-sm text-center">{{ error }}</p>

        </div>
    </div>
</template>
