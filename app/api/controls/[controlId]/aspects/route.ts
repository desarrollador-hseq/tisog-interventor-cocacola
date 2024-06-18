import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";

export async function PATCH(req: Request, { params }: { params: { controlId: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse("Unauthorized", { status: 401 })
    const values = await req.json()

    if (!params.controlId) return new NextResponse("Bad request", { status: 400 })
    if (!values.securityQuestionId) return new NextResponse("Bad request", { status: 400 })
    try {
        const { securityQuestionId,negativeQuestion, ...days } = values;
        // Actualizar o crear ChecklistItem
        const checkListItemDB = await db.checklistItem.findFirst({
            where: {
                securityQuestionId: values.securityQuestionId,
                controlReportId: params.controlId,
                
            }
        })

        if (checkListItemDB) {
            await db.checklistItem.update({
                where: {
                    id: checkListItemDB.id
                },
                data: {
                    controlReportId: params.controlId,
                    ...days,
                }
            })
        } else {
            await db.checklistItem.create({
                data: {
                    controlReportId: params.controlId,
                    securityQuestionId: securityQuestionId,
                    ...days,
                }
            })
        }

        const ncDays = Object.entries(days).filter(([key, value]) => value === "NC");

        for (const [dayName, value] of ncDays) {
            const existingFindingReport = await db.findingReport.findFirst({
                where: {
                    controlReportId: params.controlId,
                    securityQuestionId: securityQuestionId,
                    // day: dayName,
                }
            });

            if (!existingFindingReport) {
                await db.findingReport.create({
                    data: {
                        controlReportId: params.controlId,
                        securityQuestionId: securityQuestionId,
                        findingDesc: values.negativeQuestion
                        // day: dayName,
                        // finding: "No cumple", // Ajusta el mensaje según tus necesidades
                    }
                });
            }
        }

        console.log({ ...values })

        return NextResponse.json({ ok: true })

    } catch (error) {
        console.log("[ASPECTS-PATCH]", error)
        return new NextResponse("Internal Error " + error, { status: 500 })
    }
}