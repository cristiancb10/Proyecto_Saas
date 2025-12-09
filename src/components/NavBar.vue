<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import pb from "../lib/pb";

const router = useRouter();

const isLogged = ref(pb.authStore.isValid);
const userName = ref(pb.authStore.model?.name || "");
const userLastName = ref(pb.authStore.model?.lastName || "");
const userEmail = ref(pb.authStore.model?.email || "");
const userAvatar = ref(pb.authStore.model?.avatar || "");

onMounted(() => {
    pb.authStore.onChange(() => {
        isLogged.value = pb.authStore.isValid;
        userName.value = pb.authStore.model?.name || "";
        userLastName.value = pb.authStore.model?.lastName || "";
        userEmail.value = pb.authStore.model?.email || "";
        userAvatar.value = pb.authStore.model?.avatar || "";
    });
});

const logout = () => {
    pb.authStore.clear();
    isLogged.value = false;
    userName.value = "";
    userLastName.value = "";
    userEmail.value = "";
    userAvatar.value = "";
    router.push("/login");
};
</script>

<template>
    <nav class="bg-gray-800 text-white px-4 py-3 flex flex-wrap items-center justify-between shadow-lg w-full">
        <!-- Logo -->
        <h1 
            class="text-xl font-bold cursor-pointer hover:text-blue-400 w-full sm:w-auto mb-2 sm:mb-0"
            @click="router.push('/')"
        > Mi SaaS
        </h1>

        <!-- LADO DERECHO DEL NAVBAR -->
        <div class="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <!-- SI NO ESTA LOGUEADO -->
            <template v-if="!isLogged">
                <button 
                    @click="router.push('/login')"
                    class="w-full sm:w-auto text-gray-300 hover:text-white transition px-2 py-1 rounded"
                >Iniciar sesión
                </button>

                <button 
                    @click="router.push('/register')"
                    class="w-full sm:w-auto bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                >Registrarse
                </button>
            </template>

            <!-- SI ESTA LOGUEADO -->
            <template v-else>
                <!-- Avatar -->
                <img 
                    v-if="userAvatar"
                    :src="`http://127.0.0.1:8090/api/files/${pb.authStore.model.collectionId}/${pb.authStore.model.id}/${userAvatar}`"
                    alt="Avatar"
                    class="w-8 h-8 rounded-full object-cover mr-2"
                />
                <div v-else class="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-xs font-bold text-white mr-2">
                    {{ userEmail[0]?.toUpperCase() }}
                </div>

                <span
                    @click="router.push('/profile')"
                    class="w-full sm:w-auto text-gray-300 font-medium px-2 py-1 truncate cursor-pointer hover:text-white"
                >{{ userName }} {{ userLastName }}
                </span>

                <button 
                    @click="logout"
                    class="w-full sm:w-auto bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                >Cerrar sesión
                </button>
            </template>
        </div>
    </nav>
</template>