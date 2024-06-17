import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";


export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    try {
        const values = await req.json();

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!values.name) return new NextResponse("Bad request", { status: 400 })

        const existingTypeTool = await db.typeTool.findFirst({
            where: { name: values.name, active: true },
        });

        if (existingTypeTool) {
            return new NextResponse("Tipo de herramienta ya se encuentra registrado", {
                status: 400,
            });
        }

        const typeTool = await db.typeTool.create({
            data: {
                ...values,
            },
        });

        return NextResponse.json(typeTool);
    } catch (error) {
        console.log("[typeTool-CREATE]", error);
        return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
}
