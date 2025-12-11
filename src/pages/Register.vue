<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import pb from '../lib/pb.js'

const router = useRouter();

const name = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const loading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

const registerUser = async () => {
    errorMsg.value = '';
    successMsg.value = '';

    if (password.value !== passwordConfirm.value) {
        errorMsg.value = 'Las contraseñas no coinciden.';
        return;
    }

    try {
        loading.value = true;

        // Crear usuario en Pocketbase, y extra los datos de users
        const newUser = await pb.collection('users').create({
            name: name.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value,
            passwordConfirm: passwordConfirm.value
        });

        // Enviar email de verificacion
        await pb.collection('users').requestVerification(email.value);

        successMsg.value = 'Registro exitoso. Revisa tu correo y verfica tu cuenta';

        // Redirigir al login despues de 4 segundos
        setTimeout(() => router.push('/login'), 4000);
    } catch (err) {
        const emailError = err?.data?.data?.email;

        if (emailError?.code === "validation_not_unique") {
            errorMsg.value = "El correo ya está registrado. Usa otro correo.";
        } else {
            errorMsg.value = err.message || "Error inesperado al registrar.";
        }
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div class="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 class="text-2xl font-bold mb-4 text-center text-white">Crear cuenta</h1>

            <form @submit.prevent="registerUser" class="space-y-4">

                <!-- Nombre y apellido -->
                <div>
                    <label class="block font-semibold mb-1 text-gray-300">Nombre:</label>
                    <input 
                    v-model="name"
                    type="text"
                    class="w-full border border-gray-600 bg-gray-700 text-white p-2 rounded 
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    />
                </div>

                <div>
                    <label class="block font-semibold mb-1 text-gray-300">Apellidos:</label>
                    <input 
                        v-model="lastName"
                        type="text"
                        class="w-full border border-gray-600 bg-gray-700 text-white p-2 rounded 
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <!-- Email -->
                <div>
                    <label class="block font-semibold mb-1 text-gray-300">Email:</label>
                    <input
                        v-model="email"
                        type="email"
                        class="w-full border border-gray-600 bg-gray-700 text-white p-2 rounded 
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <!-- Password -->
                <div>
                    <label class="block font-semibold mb-1 text-gray-300">Contraseña:</label>
                    <input
                        v-model="password"
                        type="password"
                        class="w-full border border-gray-600 bg-gray-700 text-white p-2 rounded
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <!-- Confirmar Password -->
                <div>
                    <label class="block font-semibold mb-1 text-gray-300">Confirmar contraseña:</label>
                    <input
                        v-model="passwordConfirm"
                        type="password"
                        class="w-full border border-gray-600 bg-gray-700 text-white p-2 rounded
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <!-- Botón -->
                <button
                    type="submit"
                    :disabled="loading"
                    class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                >
                {{ loading ? 'Creando cuenta...' : 'Registrarse' }}
                </button>

                <!-- Mensajes -->
                <p v-if="errorMsg" class="text-red-400 text-sm mt-2 text-center">{{ errorMsg }}</p>
                <p v-if="successMsg" class="text-green-400 text-sm mt-2 text-center">{{ successMsg }}</p>

            </form>

            <!-- Link volver al login -->
            <p class="text-center mt-4 text-gray-300">
                ¿Ya tienes cuenta?
                <a href="/login" class="text-blue-400 font-medium hover:underline">
                Iniciar sesión
                </a>
            </p>
        </div>
    </div>
</template>