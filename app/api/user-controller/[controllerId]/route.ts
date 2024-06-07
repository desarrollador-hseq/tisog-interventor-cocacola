import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";



export async function PATCH(req: Request, { params }: { params: { controllerId: string } }) {
    try {
        const session = await getServerSession(authOptions)
        const { controllerId } = params;
        const values = await req.json()


        if (!session || !session.user.email) return new NextResponse("Unauthorized", { status: 401 })

        const controllerSaved = await db.user.findUnique({
            where: {
                id: controllerId,
                role: "USER"
            }
        })

        if (!controllerSaved) return new NextResponse("Not found", { status: 404 })

        if (values.email) {
            if (values.email !== controllerSaved.email) {
                const result = await db.user.findFirst({
                    where: {
                        email: values.email,
                        active: true,
                    }
                })
                if (result) return new NextResponse("Email ya se encuentra registrado en un usuario activo", { status: 400 })
            }
        }
        if (values.numDoc) {
            if (values.numDoc !== controllerSaved.numDoc) {
                const result = await db.user.findFirst({
                    where: {
                        numDoc: values.numDoc,
                        active: true,
                    }
                })
                if (result) return new NextResponse("Número de documento ya registrado en un usuario activo", { status: 400 })
            }
        }


        const controllerUpdated = await db.user.update({
            where: {
                id: controllerId,
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(controllerUpdated)

    } catch (error) {
        console.log("[CONTROLLER_PATCH_ID]", error)
        return new NextResponse("Internal Errorr" + error, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { controllerId: string } }) {

    try {
        const session = await getServerSession(authOptions)
        const { controllerId } = params;

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!controllerId) return new NextResponse("Not Found", { status: 404 })

        const supervisorDeleted = await db.user.update({
            where: {
                id: controllerId,
                role: "USER"
            },
            data: {
                active: false
            }
        })

        return NextResponse.json(supervisorDeleted)

    } catch (error) {
        console.log("[CONTROLLER_ID_SUPERVISOR]", error)
        return new NextResponse("Internal Errorr " + error, { status: 500 })
    }
}