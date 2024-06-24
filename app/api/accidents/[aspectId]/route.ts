import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";



export async function PATCH(req: Request, { params }: { params: { aspectId: string } }) {
    const session = await getServerSession(authOptions);
    try {
        const values = await req.json();

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!params.aspectId) return new NextResponse("Bad request", { status: 400 })
        if (!values.question) return new NextResponse("Bad request", { status: 400 })


        const aspectdb = await db.securityQuestion.findUnique({
            where: {
                id: params.aspectId
            }
        })

        if (!aspectdb) return new NextResponse("Bad request", { status: 400 })

        if (aspectdb.question !== values.question) {
            const positonExist = await db.securityQuestion.findFirst({
                where: {
                    question: values.question,
                    active: true,
                }
            })

            if (positonExist) return new NextResponse("Pregunta ya se encuentra registrada", { status: 400 })
        }

        const positon = await db.securityQuestion.update({
            where: {
                id: params.aspectId
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(positon);
    } catch (error) {
        console.log("[ASPECT-UPDATED]", error);
        return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
}


export async function DELETE(req: Request, { params }: { params: { aspectId: string } }) {

    try {
        const session = await getServerSession(authOptions)
        const { aspectId } = params;

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!aspectId) return new NextResponse("Not Found", { status: 404 })

        const aspectDeleted = await db.securityQuestion.update({
            where: {
                id: aspectId,
            },
            data: {
                active: false
            }

        })

        return NextResponse.json(aspectDeleted)

    } catch (error) {
        console.log("[DELETED_ID_ASPECT]", error)
        return new NextResponse("Internal Errorr " + error, { status: 500 })
    }
}
