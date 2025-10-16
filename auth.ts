import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';
import type { User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

export const config = {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in'
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                email: { type: 'email' },
                password: { type: 'password' }
            },
            async authorize(credentials) {
                if (credentials == null) return null;

                // Find user in database
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string
                    }
                });

                // Check if user exists and if the password matches
                if (user && user.password) {
                    const isMatch = compareSync(
                        credentials.password as string,
                        user.password
                    );

                    // If password is correct, return user
                    if (isMatch) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        } as User;
                    }
                }
                // If user does not exist or password does not match, return null
                return null;
            }
        })
    ],
    callbacks: {
        async session({ session, token, trigger }) {
            // Set the user ID from the token
            if (token.sub) {
                session.user.id = token.sub;
            }
            if (token.role) {
                session.user.role = token.role as string;
            }
            if (token.name) {
                session.user.name = token.name;
            }
            console.log(token);

            // If there is an update, set the user name
            if (trigger === 'update' && token.name) {
                session.user.name = token.name;
            }
            return session;
        },
        async jwt({ token, user, trigger }) {
            // Assign user fields to token
            if (user) {
                token.role = (user as User).role;

                // If user has no name then use the email
                if (user.name === 'NO_NAME' && user.email) {
                    token.name = user.email.split('@')[0];

                    // Update database to reflect the token name
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { name: token.name }
                    });
                }
            }
            return token;
        },
        authorized({ request, auth }) {
            // Check for session cart cookie
            if (!request.cookies.get('sessionCartId')) {
                // Generate new session cart id cookie
                const sessionCartId = crypto.randomUUID();
                // Clone the req headers
                const newRequestHeaders = new Headers(request.headers);
                // Create new headers and add the new response
                const response = NextResponse.next({
                    request: {
                        headers: newRequestHeaders
                    }
                });

                // Set newly generated sessionCartId in the response cookies
                response.cookies.set('sessionCartId', sessionCartId);
                return response;
            } else {
                return true;
            }
        }
    },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);

// Extend the built-in session types
declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string;
        };
    }

    interface User {
        role?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role?: string;
    }
}