<script setup>
import { computed, onMounted, ref } from 'vue';
import pb from '../lib/pb.js'
import { useRouter } from 'vue-router';

const tasks = ref([]); // array con todas las tareas
const totalTasks = ref(0); // número total de tareas para paginación
const currentPage = ref(1); // página actual en la paginación
const perPage = ref(5); // número de tareas por página
// Total de páginas
const totalPages = computed(() => Math.ceil(totalTasks.value / perPage.value));

const loading = ref(true); // indica si se están cargando las tareas
const errorMsg = ref(''); // mensaje de error al listar tareas

// LISTAR TAREAS
const fetchTasks = async () => {
    try {
        loading.value = true;
        // Obtener tareas desde la 1 hasta la 5 y filtra por usuario loggeado
        const response = await pb.collection('tasks').getList(currentPage.value, perPage.value, {
            filter: `owner = '${pb.authStore.model.id}'`, // solo tareas del usuario actual
            sort: '-created' // Ordena de manera descendente
        });

        tasks.value = response.items; // Guarda tareas en un array solo 5
        totalTasks.value = response.totalItems; // Actualiza el numero total de tareas
    } catch (err) {
        errorMsg.value = 'Error al cargar las tareas';
    } finally {
        loading.value = false; // terminar carga
    }
}

// PAGINACIÓN
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++; // Actualiza la página
        fetchTasks(); // Muestra las tareas
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--; // Actualiza la página
        fetchTasks(); // Muestra las tareas
    }
};

// Cargar tareas al iniciar el componente
onMounted(fetchTasks)

// CREAR TAREAS
const newTaskTitle = ref('');
const creating = ref(false); // Indicador de creación en proceso
const newTaskPriority = ref("medium");

const createTask = async () => {
    if (!newTaskTitle.value.trim()) return;

    try {
        creating.value = true;

        // Crear tarea en PocketBase
        const created = await pb.collection('tasks').create({
            title: newTaskTitle.value,
            completed: false,
            priority: newTaskPriority.value,
            owner: pb.authStore.model.id
        });

        tasks.value.unshift(created); // Agrega tarea al inicio del array
        newTaskPriority.value = "medium";
        newTaskTitle.value = '';
    } catch (err) {
        alert('Error al crear tarea')
    } finally {
        creating.value = false;
    }
}

// ELIMINAR TAREA
const deleteTask = async (task) => {
    if (!confirm("¿Seguro que quiere eliminar la tarea?")) return;

    try {
        await pb.collection('tasks').delete(task.id);
        tasks.value = tasks.value.filter(t => t.id !== task.id);
    } catch (err) {
        alert("No se pudo eliminar la tarea.");
    }
}

// ACTUALIZAR TAREA
const editingTask = ref(null); // tarea en edición
const editingTitle = ref(''); // nuevo título temporal
const savingEdit = ref(false); // indicador de guardado en proceso

const startEdit = (task) => {
    editingTask.value = task; // marcar tarea para edición
    editingTitle.value = task.title; // copiar título actual
};

const cancelEdit = () => {
    editingTask.value = null;  // cancelar edición
    editingTitle.value = ''; // limpiar título temporal
};

const saveEdit = async () => {
    try {
        savingEdit.value = true;

        // Actualizar tarea en PocketBase
        const updated = await pb.collection('tasks').update(editingTask.value.id, {
            title: editingTitle.value
        });

        // Remplazar en array
        const idx = tasks.value.findIndex(t => t.id === editingTask.value.id);
        tasks.value[idx] = updated;

        cancelEdit(); // limpiar edición
    } catch (err) {
        alert("Error al actualizar la tarea");
    } finally {
        savingEdit.value = false;
    }
}

// MARCAR TAREA
const toggleCompleted = async (task) => {
    try {
        const updated = await pb.collection('tasks').update(task.id, {
        completed: task.completed
        });

        // actualizar localmente
        const idx = tasks.value.findIndex(t => t.id === task.id);
        tasks.value[idx] = updated;
    } catch (err) {
        alert('No se pudo actualizar el estado de la tarea.');
        // revertir cambio local si falla
        task.completed = !task.completed;
    }
};

// FILTRADO Y BUSCADOR DE TAREAS
const filterStatus = ref("all"); // filtro por estado (all, pending, completed)
const filterPriority = ref("all"); // filtro por prioridad (all, low, medium, high)
const searchQuery = ref(""); // búsqueda por título

const filteredTasks = computed(() => {
    return tasks.value.filter(task => {
        // Filtro por búsqueda
        if (!task.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
            return false;

        if (filterStatus.value === "pending" && task.completed) return false; // filtrar pendientes
        if (filterStatus.value === "completed" && !task.completed) return false; // filtrar completadas
        
        // Filtro por prioridad
        if (filterPriority.value !== "all" && task.priority !== filterPriority.value) return false;

        return true;
    });
});

// LOGOUT
const router = useRouter();

const logout = () => {
    pb.authStore.clear(); // limpiar sesión
    router.push('/login');
}
</script>

<template>
    <div class="min-h-screen p-4 bg-gray-900">
        <div class="max-w-3xl  mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 class="text-2xl font-bold mb-4 text-white">Mis tareas</h1>
            
            <!-- FORM CREAR TAREA -->
            <div class="flex flex-col sm:flex-row gap-2 mb-4 items-center w-full">
                <input
                    v-model="newTaskTitle"
                    placeholder="Nueva tarea..."
                    class="w-full sm:flex-1 border border-gray-600 bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />            

                <select 
                    v-model="newTaskPriority"
                    class="w-full sm:w-auto border border-gray-600 bg-gray-700 text-white p-2 rounded"
                >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                </select>

                <button
                    @click="createTask"
                    :disabled="creating"
                    class="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    {{ creating ? 'Agregando...' : 'Agregar' }}
                </button>
            </div>

            <!-- ERROR -->
            <p v-if="errorMsg" class="text-red-500 mb-2">{{ errorMsg }}</p>

            <!-- LISTA DE TAREAS -->
            <div class="flex flex-col sm:flex-row gap-3 mb-4 w-full">
                <select 
                    v-model="filterStatus"
                    class="bg-gray-700 text-white p-2 rounded"
                >
                    <option value="all">Todas</option>
                    <option value="pending">Pendientes</option>
                    <option value="completed">Completadas</option>
                </select>

                <select 
                    v-model="filterPriority"
                    class="bg-gray-700 text-white p-2 rounded"
                >
                    <option value="all">Todas</option>
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                </select>
            </div>

            <input 
                v-model="searchQuery"
                placeholder="Buscar tarea..."
                class="w-full bg-gray-700 text-white border border-gray-600 p-2 rounded mb-4"
            />

            <ul v-if="filteredTasks.length > 0" class="space-y-2">
                <li
                    v-for="task in filteredTasks"
                    :key="task.id"
                    class="p-3 border border-gray-700 rounded bg-gray-700 flex flex-col gap-2"
                >
                    <!-- FILA SUPERIOR: ESTADO, PRIORIDAD -->
                    <div class="flex justify-between items-center w-full flex-wrap gap-2">
                        
                        <!-- IZQUIERDA -->
                        <div class="flex items-center gap-3 flex-wrap">
                            <input 
                                type="checkbox" 
                                v-model="task.completed" 
                                @change="toggleCompleted(task)" 
                                class="w-4 h-4"
                            />

                            <span 
                                :class="task.completed 
                                    ? 'bg-green-500 text-white px-2 py-1 rounded' 
                                    : 'bg-yellow-300 text-black px-2 py-1 rounded'"
                            >
                                {{ task.completed ? 'Completado' : 'Pendiente' }}
                            </span>

                            <span 
                                :class="{
                                    'bg-green-600 text-white px-2 py-1 rounded text-xs': task.priority === 'low',
                                    'bg-yellow-400 text-black px-2 py-1 rounded text-xs': task.priority === 'medium',
                                    'bg-red-600 text-white px-2 py-1 rounded text-xs': task.priority === 'high',
                                }"
                            >
                                {{ task.priority === 'low' ? 'Baja' : task.priority === 'medium' ? 'Media' : 'Alta' }}
                            </span>
                        </div>

                        <!-- DERECHA: Editar y cancelar edición -->
                        <div class="flex flex-col sm:flex-row sm:items-center gap-1 w-full sm:w-auto">
                            
                            <template v-if="editingTask?.id === task.id">
                                <button
                                    @click="saveEdit"
                                    :disabled="savingEdit"
                                    class="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto"
                                >Guardar
                                </button>

                                <button
                                    @click="cancelEdit"
                                    class="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 w-full sm:w-auto"
                                >Cancelar
                                </button>
                            </template>

                            <template v-else>
                                <button
                                    @click="startEdit(task)"
                                    class="px-2 py-1 text-base bg-yellow-300 text-black rounded hover:bg-yellow-400 w-full sm:w-auto"
                                >Editar
                                </button>

                                <button
                                    @click="deleteTask(task)"
                                    class="px-2 py-1 text-base bg-red-600 text-white rounded hover:bg-red-700 w-full sm:w-auto"
                                >Eliminar
                                </button>
                            </template>
                        </div>
                    </div>

                    <!-- FILA INFERIOR: TITULO / EDICIÓN -->
                    <div>
                        <template v-if="editingTask?.id === task.id">
                            <input
                                v-model="editingTitle"
                                class="w-full border border-gray-600 bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </template>

                        <template v-else>
                            <span class="text-white break-words w-full block">
                                {{ task.title }}
                            </span>
                        </template>
                    </div>
                </li>

            </ul>
            
            <p v-else class="text-gray-300 text-center mt-4">
                Aun no tiene tareas.
            </p>
            <!-- Paginacion -->
            <div class="flex justify-center items-center gap-2 mt-4 flex-wrap">
                <button 
                    @click="prevPage" 
                    :disabled="currentPage === 1"
                    class="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                >Anterior
                </button>

                <span class="text-white px-2">
                    Página {{ currentPage }} de {{ totalPages }}
                </span>

                <button 
                    @click="nextPage" 
                    :disabled="currentPage === totalPages"
                    class="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                >Siguiente
                </button>
            </div>
        </div>
    </div>
</template>