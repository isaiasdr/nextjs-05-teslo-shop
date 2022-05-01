import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {

    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if ( !session ) {
        const url = req.nextUrl.clone();
        url.pathname = '/auth/login';
        return NextResponse.redirect(`${ url }?p=${ req.page.name }`);
    }

    const validRoles = [ 'admin', 'super-user', 'SEO' ];

    if ( !validRoles.includes( session.user.role )) {
        const url = req.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect( url );
    }

    return NextResponse.next();
}
