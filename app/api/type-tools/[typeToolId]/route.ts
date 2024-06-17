import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";



export async function PATCH(req: Request, { params }: { params: { typeToolId: string } }) {
    const session = await getServerSession(authOptions);
    try {
        const values = await req.json();

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!params.typeToolId) return new NextResponse("Bad request", { status: 400 })
        if (!values.name) return new NextResponse("Bad request", { status: 400 })


        const tooldb = await db.typeTool.findUnique({
            where: {
                id: params.typeToolId
            }
        })

        if (!tooldb) return new NextResponse("Bad request", { status: 400 })

        if (tooldb.name !== values.name) {
            const typeToolExist = await db.typeTool.findFirst({
                where: {
                    name: values.name,
                    active: true,
                }
            })

            if (typeToolExist) return new NextResponse("Tipo de herramienta ya se encuentra registrado", { status: 400 })
        }

        const typeTool = await db.typeTool.update({
            where: {
                id: params.typeToolId
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(typeTool);
    } catch (error) {
        console.log("[typeTool-UPDATED]", error);
        return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
}


export async function DELETE(req: Request, { params }: { params: { typeToolId: string } }) {

    try {
        const session = await getServerSession(authOptions)
        const { typeToolId } = params;

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!typeToolId) return new NextResponse("Not Found", { status: 404 })

        const typeToolDeleted = await db.typeTool.update({
            where: {
                id: typeToolId,
            },
            data: {
                active: false
            }

        })

        return NextResponse.json(typeToolDeleted)

    } catch (error) {
        console.log("[DELETED_ID_typeTool]", error)
        return new NextResponse("Internal Errorr " + error, { status: 500 })
    }
}
