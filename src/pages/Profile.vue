<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import pb from "../lib/pb.js";

const router = useRouter();

const user = ref({ ...pb.authStore.model });
const newAvatar = ref(null);

// Cuando el usuario selecciona nueva imagen
const onFileChange = (e) => {
    newAvatar.value = e.target.files[0];
};

const updateProfile = async () => {
    try {
        const formData = new FormData();

        formData.append("name", user.value.name);
        formData.append("lastName", user.value.lastName);

        if (newAvatar.value) {
            formData.append("avatar", newAvatar.value);
        }

        const updated = await pb
            .collection("users")
            .update(user.value.id, formData);

        pb.authStore.save(pb.authStore.token, updated);
        alert("Perfil actualizado correctamente");
    } catch (error) {
        console.error(error);
        alert("Error al actualizar perfil");
    }
};
</script>

<template>
    <!-- Contenedor general con fondo oscuro para igualar los otros templates -->
    <div class="min-h-screen w-full bg-gray-900 text-white flex justify-center items-start py-10">

        <div class="max-w-xl w-full p-6">

            <!-- Volver -->
            <button 
                @click="router.push('/tasks')" 
                class="text-blue-400 hover:underline text-base mb-4"
            >← Volver a mis tareas
            </button>

            <h1 class="text-2xl font-bold mb-4">Mi Perfil</h1>

            <!-- ACTUALIZAR DATOS -->
            <div class="bg-gray-800 p-5 rounded-lg shadow-md space-y-6">

                <!-- Avatar -->
                <div class="flex flex-col sm:flex-row items-center gap-4">
                    
                    <img
                        v-if="user.avatar"
                        :src="pb.files.getUrl(user, user.avatar)"
                        class="w-24 h-24 rounded-full object-cover border border-gray-600"
                    />

                    <div 
                        v-else 
                        class="w-24 h-24 rounded-full bg-gray-600 text-white flex items-center justify-center text-3xl font-bold"
                    >{{ user.email[0]?.toUpperCase() }}
                    </div>

                    <div class="flex flex-col text-sm w-full sm:w-auto">
                        <label class="mb-1 text-gray-300">Cambiar avatar</label>
                        <input
                            type="file"
                            accept="image/*"
                            @change="onFileChange"
                            class="text-gray-300"
                        />
                    </div>
                </div>

                <!-- Nombre y apellidos -->
                <div class="space-y-3">
                    <input
                        v-model="user.name"
                        placeholder="Nombre"
                        class="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                    />

                    <input
                        v-model="user.lastName"
                        placeholder="Apellido"
                        class="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                    />
                </div>

                <!-- Guardar cambios -->
                <button
                    @click="updateProfile"
                    class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >Guardar cambios
                </button>
            </div>
        </div>
    </div>
</template>