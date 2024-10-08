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

export async function DELETE(req: Request, { params }: { params: { controlId: string } }) {

    try {
        const session = await getServerSession(authOptions)
        const { controlId } = params;

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!controlId) return new NextResponse("Not Found", { status: 404 })

        const reportDeleted = await db.controlReport.update({
            where: {
                id: controlId,
            },
            data: {
                active: false
            }

        })

        return NextResponse.json(reportDeleted)

    } catch (error) {
        console.log("[DELETED_ID_REPORT", error)
        return new NextResponse("Internal Errorr " + error, { status: 500 })
    }
}