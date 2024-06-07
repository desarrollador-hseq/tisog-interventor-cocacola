import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    try {
        const values = await req.json();

        if (!session || !session.user.email) return new NextResponse("Unauthorized", { status: 401 })

        const existingController = await db.user.findFirst({
            where: { email: values.email, active: true },
        });

        const existingController2 = await db.user.findFirst({
            where: { numDoc: values.numDoc, active: true },
        });

        if (existingController) {
            return new NextResponse("Correo electrónico ya registrado", {
                status: 400,
            });
        }
        if (existingController2) {
            return new NextResponse("Número de documento ya registrado", {
                status: 400,
            });
        }

        const controller = await db.user.create({
            data: {
                role: "USER",
                ...values,
            },
        });

        return NextResponse.json(controller);
    } catch (error) {
        console.log("[CONTROLLER-CREATE]", error);
        return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
}