<script setup>
import { ref } from 'vue';
import pb from '../lib/pb.js'
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const message = ref('');
const errorMsg = ref('');

const sendReset = async () => {
    message.value = '';
    errorMsg.value = '';

    try {
        await pb.collection('users').requestPasswordReset(email.value, {
            url: `http://localhost:5173/confirm-reset?token={token}`
        });
        message.value = 'Se envió un enlace a tu correo para restablecer tu contraseña.';
    } catch (err) {
        errorMsg.value = 'No se pudo enviar el correo. Verifica el email.';
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div class="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        
        <h1 class="text-2xl font-bold mb-4 text-white text-center">Recuperar contraseña</h1>

        <input
            v-model="email"
            type="email"
            placeholder="Tu email"
            class="w-full border border-gray-600 bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <button
            @click="sendReset"
            class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >Enviar enlace
        </button>

        <p v-if="message" class="text-green-400 mt-3 text-sm">{{ message }}</p>
        <p v-if="errorMsg" class="text-red-400 mt-3 text-sm">{{ errorMsg }}</p>

        <!-- Volver al login -->
        <button
            @click="router.push('/login')"
            class="w-full mt-4 bg-gray-600 text-white p-2 rounded hover:bg-gray-700 transition"
        >Volver al login
        </button>

        </div>
    </div>
</template>
