# PROYECTO DE GESTIÓN DE TAREAS CON VUE Y POCKETBASE

**Materia:** Desarrollo Web Fronted INF-460  
**Estudiante:** Cristian Coca Bejarano

Este proyecto es una aplicación web desarrollada con **Vue**, **Vite**, **TailwindCSS** y **PocketBase** (vía **Mailpit**) como backend. Incluye autenticación, gestión de tareas, actualización de perfil y carga de avatar.

---

## CARACTERISTICAS PRINCIPALES:

### Autenticación
- Registro de nuevos usuarios
- Inicio y cierre de sesión
- Restablecimiento de contraseña mediante correo
- Protección de rutas mediante middleware

### Módulo de tareas
- Crear tareas
- Listar tareas
- Paginación
- Editar tareas
- Eliminar tareas
- Mostrar solo las tareas del usuario autenticado

### Perfil de usuario
- Actualizar nombre y apellido
- Subir o cambiar avatar
- Mostrar avatar en la barra de navegación
- Vista adaptada a pantallas pequeñas

---

## REQUISITOS PREVIOS:

### Frontend
- Node.js
- npm
- Tailwindcss

En caso no reconozca Tailwindcss, se recomienda crear el archivo `tailwind.config.js`:

```
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
```

Y modificar el vite.config.js

```
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Se Agrega el componente de tailwindcss
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()]
})
```

### Backend

- PocketBase (descarga necesaria)
- Mailpit (descarga necesaria y ubicacion en Path)

---

## INSTALACIÓN

### Clonar el repositorio

```
git clone https://github.com/cristiancb10/Proyecto_Saas.git
cd Proyecto_Saas
```

### Instalar dependencias

```
npm install
npm install pocketbase
npm install -D tailwindcss postcss autoprefixer
```

### Iniciar servidor de desarrollo, pocketbase y servidor de correos (a la vez)

```
npm run dev
pocketbase serve
mailpit
```
---

## CREAR COLECCIONES

### Colección: users (auth)
Se crea automáticamente algunos campos. Pero a ello el campo:

| Campo    | Tipo | Requerido | Notas                     |
|----------|------|-----------|---------------------------|
| lastName | text | no        | Apellido del usuario      |

Habilitar autenticación de tipo email/password.

### Colección: tasks
Debe crearse manualmente.

| Campo     | Tipo      | Requerido | Notas                          |
|-----------|-----------|-----------|--------------------------------|
| title     | text      | sí        | Nombre de la tarea             |
| completed | bool      | no        | Estado de la tarea             |
| priority  | selection | sí        | Prioridad (low, medium, high)  |
| owner     | relation  | sí        | Relación con users             |

Otorgar reglas de CRUD en Pocketbase, para podre interactuar.

---

## ESTRUCTURA DEL PROYECTO

```
src/
 ├─ components/
 │   ├─ NavBar.vue
 ├─ pages/
 │   ├─ Login.vue
 │   ├─ Register.vue
 │   ├─ Tasks.vue
 │   ├─ Profile.vue
 │   ├─ ResetPassword.vue
 │   └─ ConfirmReset.vue
 ├─ router/
 │   └─ index.js
 ├─ lib/
 │   └─ pb.js   (configuración de PocketBase)
 └─ App.vue
 └─ main.css    (Donde se agrega @import "tailwindcss";)
```

---

## NOTAS FINALES
Este proyecto está pensado como base para aplicaciones que requieren autenticación, carga de archivos e interacción sencilla con un backend ligero como PocketBase.
La estructura es modular y permite extender fácilmente nuevas funciones como categorías, filtros, roles, etc.