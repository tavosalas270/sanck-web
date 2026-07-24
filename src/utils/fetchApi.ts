'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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
    let response = await fetch(url, {
        ...options,
        method,
        headers,
    });

    // Si devuelve 401 (Unauthorized) y tenemos un refresh token, intentamos renovar el access token
    if (response.status === 401) {
        const refreshTokenVal = cookieStore.get('refresh')?.value;
        if (refreshTokenVal) {
            try {
                // Importamos el servicio aquí para evitar problemas si se carga antes del contexto necesario
                const { refreshAuthToken } = await import('../features/auth/services/auth.service');
                const newTokenData = await refreshAuthToken(refreshTokenVal);
                
                if (newTokenData && newTokenData.access) {
                    // Actualizamos el header con el nuevo access token
                    headers.set('Authorization', `Bearer ${newTokenData.access}`);
                    
                    // Reintentamos la llamada original con el nuevo token
                    response = await fetch(url, {
                        ...options,
                        method,
                        headers,
                    });
                }
            } catch (error) {
                console.error("Error refreshing token in fetchApi:", error);
                // Si la renovación falla (ej. refresh token expirado), borramos cookies y redirigimos
                cookieStore.delete('access');
                cookieStore.delete('refresh');
                redirect('/');
            }
        } else {
            // Si no hay refresh token, también cerramos sesión y redirigimos
            cookieStore.delete('access');
            cookieStore.delete('refresh');
            redirect('/');
        }
    }

    return response;
};
