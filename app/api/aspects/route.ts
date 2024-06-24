import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";


export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    try {
        const values = await req.json();

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!values.question) return new NextResponse("Bad request", { status: 400 })

        const existingAspect = await db.securityQuestion.findFirst({
            where: { question: values.question, active: true },
        });

        if (existingAspect) {
            return new NextResponse("Pregunta ya se encuentra registrada", {
                status: 400,
            });
        }

        const defaultAspect = await db.securityQuestion.create({
            data: {
                ...values,
            },
        });

        return NextResponse.json(defaultAspect);
    } catch (error) {
        console.log("[ASPECT-CREATE]", error);
        return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
}
