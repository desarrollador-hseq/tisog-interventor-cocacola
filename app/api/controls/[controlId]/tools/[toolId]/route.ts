import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";


export async function PATCH(
    req: Request,
    { params }: { params: { controlId: string, toolId: string } }
) {
    const session = await getServerSession(authOptions);
    try {
        if (!session || !session.user.email)
            return new NextResponse("Unauthorized", { status: 401 });
        const values = await req.json();
        const tool = await db.tool.findFirst({
            where: {
                controlReportId: params.controlId,
                id: params.toolId,
            }
        })

        if (tool) {
            const hazardItemUpdated = await db.tool.update({
                where: {
                    id: tool.id
                },
                data: {
                    ...values,
                }
            })
        }

        return NextResponse.json({ message: "ok" });
    } catch (error) {
        console.log("[PATCH-TOOL-CONTROL]", error);
        return new NextResponse("Internal Errorr: " + error, { status: 500 });
    }
}


export async function DELETE(
    req: Request,
    { params }: { params: { controlId: string, toolId: string } }
) {
    const session = await getServerSession(authOptions);
    try {
        if (!session || !session.user.email)
            return new NextResponse("Unauthorized", { status: 401 });

        const hazardItem = await db.tool.findFirst({
            where: {
                controlReportId: params.controlId,
                id: params.toolId,
            }
        })

        if (hazardItem) {
            const hazardItemDeleted = await db.tool.delete({
                where: {
                    id: hazardItem.id
                }
            })
        }


        return NextResponse.json({ message: "ok" });
    } catch (error) {
        console.log("[DELETE-TOOL-CONTROL]", error);
        return new NextResponse("Internal Errorr: " + error, { status: 500 });
    }
}