import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { token: string } }) {

    try {
        const values = await req.json()

        const passwordResetToken = await db.passwordResetToken.findUnique({
            where: {
                token: params.token,
                // createdAt:  { gt: new Date(Date.now() - 1000 * 60 * 60 * 4) }
                createdAt: { gt: new Date(Date.now() - 1000 * 60 * 60 * 4) },
                resetAt: null
            }
        })

        if (!passwordResetToken) {
            return new NextResponse("Solicitud de restablecimiento de token no válida. Intente restablecer su contraseña nuevamente.", { status: 400 });
        }

        const password = values.password
        const confirmPassword = values.repeatPassword

        if (
            !password ||
            typeof password !== 'string' ||
            password !== confirmPassword
        ) {
            return new NextResponse("Por favor verifique las contraseñas enviadas", { status: 400 });

        }

        const encrypted = await hash(password, 10)

        const updatedUserPassword = await db.user.update({
            where: { id: passwordResetToken.userId },
            data: {
                password: encrypted,
            },
        })

        const updatedToken = await db.passwordResetToken.update({
            where: {
                id: passwordResetToken.id,
            },
            data: {
                resetAt: new Date(),
            },
        })

        return NextResponse.json({ updatedUserPassword })

    } catch (error) {
        console.log("[RESET-PASSWORD]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }
}