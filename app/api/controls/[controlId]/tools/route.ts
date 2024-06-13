import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
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
        const tool = await db.tool.findFirst({
            where: {
                name: values.name,
                controlReportId: params.controlId,
            }
        })

        if (tool) {
            return new NextResponse("Ya existe un registro con ese nombre", { status: 400 });
        }

        const newTool = await db.tool.create({
            data: {
                controlReportId: params.controlId,
                name: values.name,
                toolDefaultId: values.toolDefaultId ? values.toolDefaultId : null,
            }
        })

        return NextResponse.json(newTool);
    } catch (error) {
        console.log("[CREATE-TOOL-CONTROL]", error);
        return new NextResponse("Internal Errorr: " + error, { status: 500 });
    }
}