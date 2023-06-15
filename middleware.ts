/* En la versión 13 de next todos los middelware se encuentran dentro de este archivo y son filtrados segun la ruta del path */
import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, event: NextFetchEvent) {

    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    //Solo pueden ingresar perfiles de administracion
    if (req.nextUrl.pathname.startsWith('/api/admin')) {
        if (!session) {
            return new NextResponse(JSON.stringify({ mesaage: 'No autorizado' }), {
                status: 401,
                headers: {
                    'Content-Type': 'aplication/json'
                }
            });
        }
        const validRoles = ['admin', 'super-user', 'SEO'];

        if (!validRoles.includes(session.user.role)) {
            return new NextResponse(JSON.stringify({ mesaage: 'No autorizado' }), {
                status: 401,
                headers: {
                    'Content-Type': 'aplication/json'
                }
            });
        }
    }

    if (!session) {
        const requestedPage = req.nextUrl.pathname;
        const url = req.nextUrl.clone();
        if (!req.nextUrl.pathname.startsWith('/admin')) {
            url.pathname = '/auth/login';
            url.search = `page=${requestedPage}`;
        } else {
            url.pathname = '/';
        }

        return NextResponse.redirect(url);
    }

    //Solo pueden ingresar perfiles de administracion
    if (req.nextUrl.pathname.startsWith('/admin')) {
        const validRoles = ['admin', 'super-user', 'SEO'];

        if (!validRoles.includes(session.user.role)) {
            const url = req.nextUrl.clone();
            url.pathname = '/';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/checkout/address',
        '/checkout/summary',
        '/admin/:path*',
        '/api/admin/:path*',
    ]
}