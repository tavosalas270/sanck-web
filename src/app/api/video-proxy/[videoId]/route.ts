import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ videoId: string }> }
) {
    const { videoId } = await params;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const backendUrl = `${baseUrl}/api/videos/${videoId}/play/`;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Pasar el header Range si el navegador lo envía (necesario para seek en el <video>)
    const rangeHeader = request.headers.get('Range');
    if (rangeHeader) {
        headers['Range'] = rangeHeader;
    }

    const backendResponse = await fetch(backendUrl, {
        method: 'GET',
        headers,
    });

    if (!backendResponse.ok && backendResponse.status !== 206) {
        return new NextResponse(null, { status: backendResponse.status });
    }

    // Hacer pipe del stream directamente al cliente (sin cargar en memoria)
    const responseHeaders = new Headers();
    const contentType = backendResponse.headers.get('Content-Type');
    const contentLength = backendResponse.headers.get('Content-Length');
    const contentRange = backendResponse.headers.get('Content-Range');
    const acceptRanges = backendResponse.headers.get('Accept-Ranges');

    if (contentType) responseHeaders.set('Content-Type', contentType);
    if (contentLength) responseHeaders.set('Content-Length', contentLength);
    if (contentRange) responseHeaders.set('Content-Range', contentRange);
    if (acceptRanges) responseHeaders.set('Accept-Ranges', acceptRanges);
    return new NextResponse(backendResponse.body, {
        status: backendResponse.status,
        headers: responseHeaders,
    });
}
