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

        const existingTool = await db.defaultTool.findFirst({
            where: { name: values.name, active: true },
        });

        if (existingTool) {
            return new NextResponse("Herramienta ya se encuentra registrada", {
                status: 400,
            });
        }

        const defaultTool = await db.defaultTool.create({
            data: {
                ...values,
            },
        });

        return NextResponse.json(defaultTool);
    } catch (error) {
        console.log("[TOOL-CREATE]", error);
        return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
}
