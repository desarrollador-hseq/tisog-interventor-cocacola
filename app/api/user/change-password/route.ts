import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { hash } from "bcryptjs";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);

    try {
        if (!session) return new NextResponse("Unauthorized", { status: 401 });
        const values = await req.json();

        const user = await db.user.findUnique({
            where: {
                id: session.user.id,
                active: true,
            },
        });

        if (!user) {
            return new NextResponse("No se encontro al usuario", { status: 401 });
        }

        const { actualPassword, password } = values;

        if (actualPassword === password) {
            return new NextResponse("No puedes ingresar la misma contraseña", {
                status: 400,
            });
        }

        if (!password || !actualPassword || typeof password !== "string") {
            return new NextResponse("Por favor verifique la contraseñas enviada", {
                status: 400,
            });
        }

        const isValidPassword = bcrypt.compareSync(
            actualPassword!,
            user?.password!
        );

        if (!isValidPassword) {
            return new NextResponse("la contraseña actual es incorrecta", {
                status: 400,
            });
        }

        const encrypted = await hash(password, 10);

        const updatedUser = await db.user.update({
            where: { id: user.id },
            data: {
                password: encrypted,
            },
        });

        return NextResponse.json({ updatedUser });
    } catch (error) {
        console.log("[CHANGE-PASSWORD]", error);
        return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
}
