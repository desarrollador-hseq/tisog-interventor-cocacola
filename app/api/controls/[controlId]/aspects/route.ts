
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
                    ...values,
                }
            })
        } else {
            await db.checklistItem.create({
                data: {
                    controlReportId: params.controlId,
                    ...values,
                }
            })
        }

        if (values.day1 === "NC" || values.day2 === "NC" || values.day3 === "NC" ||
            values.day4 === "NC" || values.day5 === "NC" || values.day6 === "NC" || values.day7 === "NC") {
            const existingFindingReport = await db.findingReport.findFirst({
                where: {
                    controlReportId: params.controlId,
                }
            });

            if (!existingFindingReport) {
                // Crear un nuevo FindingReport
                await db.findingReport.create({
                    data: {
                        controlReportId: params.controlId,
                    }
                });
            }
        }

        console.log({ ...values })


        return NextResponse.json({ ok: true })

    } catch (error) {
        console.log("[ASPECTS-PATCH]", error)
        return new NextResponse("Internal Errorr " + error, { status: 500 })
    }
}