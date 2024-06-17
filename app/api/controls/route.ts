import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";


export async function POST(
    req: Request,
    { params }: { params: { controlId: string } }
) {
    const session = await getServerSession(authOptions);
    try {
        if (!session || !session.user.email)
            return new NextResponse("Unauthorized", { status: 401 });
        const values = await req.json();


        const newTool = await db.controlReport.create({
            data: {
                ...values
            }
        })

        return NextResponse.json(newTool);
    } catch (error) {
        console.log("[CREATE-TOOL-CONTROL]", error);
        return new NextResponse("Internal Errorr: " + error, { status: 500 });
    }
}