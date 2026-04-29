'use server';

import { cookies } from 'next/headers';

interface FetchApiOptions extends RequestInit {
    // Puedes extender las opciones aquí si es necesario
}

export const fetchApi = async (endpoint: string, method: string = 'GET', options: FetchApiOptions = {}) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // Obtener las cookies y el token en el servidor
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;

    // Inicializar Headers
    const headers = new Headers(options.headers);

    // Configurar Content-Type por defecto si no es FormData y no se ha provisto uno
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    // Agregar el token de acceso al header Authorization de forma automática
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    // Construir la URL completa
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

    // Ejecutar el fetch nativo con nuestros headers y opciones
    const response = await fetch(url, {
        ...options,
        method,
        headers,
    });

    return response;
};
