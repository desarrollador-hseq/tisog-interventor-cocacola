import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";



export async function PATCH(req: Request, { params }: { params: { toolId: string } }) {
    const session = await getServerSession(authOptions);
    try {
        const values = await req.json();

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!params.toolId) return new NextResponse("Bad request", { status: 400 })
        if (!values.name) return new NextResponse("Bad request", { status: 400 })


        const tooldb = await db.defaultTool.findUnique({
            where: {
                id: params.toolId
            }
        })

        if (!tooldb) return new NextResponse("Bad request", { status: 400 })

        if (tooldb.name !== values.name) {
            const positonExist = await db.defaultTool.findFirst({
                where: {
                    name: values.name,
                    active: true,
                }
            })

            if (positonExist) return new NextResponse("Herramienta ya se encuentra registrada", { status: 400 })
        }

        const positon = await db.defaultTool.update({
            where: {
                id: params.toolId
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(positon);
    } catch (error) {
        console.log("[TOOL-UPDATED]", error);
        return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
}


export async function DELETE(req: Request, { params }: { params: { toolId: string } }) {

    try {
        const session = await getServerSession(authOptions)
        const { toolId } = params;

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!toolId) return new NextResponse("Not Found", { status: 404 })

        const toolDeleted = await db.defaultTool.update({
            where: {
                id: toolId,
            },
            data: {
                active: false
            }

        })

        return NextResponse.json(toolDeleted)

    } catch (error) {
        console.log("[DELETED_ID_TOOL]", error)
        return new NextResponse("Internal Errorr " + error, { status: 500 })
    }
}
