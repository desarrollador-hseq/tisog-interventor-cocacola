import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";



export async function PATCH(req: Request, { params }: { params: { accidentId: string } }) {
    const session = await getServerSession(authOptions);
    try {
        const values = await req.json();

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!params.accidentId) return new NextResponse("Bad request", { status: 400 })
        if (!values) return new NextResponse("Bad request", { status: 400 })


        const accident = await db.accidents.findUnique({
            where: {
                id: params.accidentId
            }
        })

        if (!accident) return new NextResponse("Bad request", { status: 400 })

        const accidents = await db.accidents.update({
            where: {
                id: params.accidentId,
            },
            data: {
                ...values
            }

        })

        return NextResponse.json(accidents);
    } catch (error) {
        console.log("[ACCIDENTS-UPDATED]", error);
        return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
}


export async function DELETE(req: Request, { params }: { params: { accidentId: string } }) {

    try {
        const session = await getServerSession(authOptions)
        const { accidentId } = params;

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!accidentId) return new NextResponse("Not Found", { status: 404 })

        const aspectDeleted = await db.accidents.update({
            where: {
                id: accidentId,
            },
            data: {
                active: false
            }

        })

        return NextResponse.json(aspectDeleted)

    } catch (error) {
        console.log("[DELETED_ID_ACCIDENT]", error)
        return new NextResponse("Internal Errorr " + error, { status: 500 })
    }
}
