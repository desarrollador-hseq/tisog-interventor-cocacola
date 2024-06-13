import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";


export async function PATCH(req: Request, { params }: { params: { controlId: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse("Unauthorized", { status: 401 })
    const values = await req.json()

    if(!params.controlId) return new NextResponse("Bad request", { status: 400 })
    try {

        const job = await db.controlReport.update({
            where: {
                id: params.controlId
            },
            data: {
               ...values
            }
        })

        return NextResponse.json(job)

    } catch (error) {
        console.log("[CONTROL-PATCH]", error)
        return new NextResponse("Internal Errorr " + error, { status: 500 })
    }
}