import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";


export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    try {
        const values = await req.json();

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        // if (!values.question) return new NextResponse("Bad request", { status: 400 })

      
        const accident = await db.accidents.create({
            data: {
                ...values,
            },
        });

        return NextResponse.json(accident);
    } catch (error) {
        console.log("[ACCIDENT-CREATE]", error);
        return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
}
