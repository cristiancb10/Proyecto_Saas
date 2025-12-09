import PocketBase from 'pocketbase';

// Conexion al servidor pocketbase
export const pb = new PocketBase('http://127.0.0.1:8090');

// Persistencia de la sesion:
// Cargar sesion desde cookie al iniciar la app
pb.authStore.loadFromCookie(document.cookie);

// Guarda sesion y hace un callback cada vez que cambia el estado de autenticacion
pb.authStore.onChange(() => {
    document.cookie = pb.authStore.exportToCookie({
        httpOnly: false, // La coockie es accesible desde javascript
        secure: false, // Permite HTTP
        sameSite: 'lax' //Permite enlaces desde otros sitios
    });
});

export default pb;