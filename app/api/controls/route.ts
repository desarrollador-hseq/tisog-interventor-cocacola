import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";
import { ControlReport } from "@prisma/client";


export async function POST(
    req: Request,
    { params }: { params: { controlId: string } }
) {
    const session = await getServerSession(authOptions);
    try {
        if (!session || !session.user.email)
            return new NextResponse("Unauthorized", { status: 401 });
        const values = await req.json();

        let control: ControlReport | null = null;

        if (values.source === "checklist") {
            control = await db.controlReport.create({
                data: {
                    ...values
                }
            })

        } else {
            const { contractorId, ...rest } = values
            control = await db.controlReport.create({
                data: {
                    ...rest
                }
            })

            const newfinding = await db.findingReport.create({
                data: {
                    controlReportId: control.id,
                }
            })
        }

        return NextResponse.json(control);
    } catch (error) {
        console.log("[CREATE-TOOL-CONTROL]", error);
        return new NextResponse("Internal Errorr: " + error, { status: 500 });
    }
}