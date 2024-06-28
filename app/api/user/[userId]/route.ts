import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";



export async function PATCH(req: Request, { params }: { params: { userId: string } }) {
    try {
        const session = await getServerSession(authOptions)
        const { userId } = params;
        const values = await req.json()

        if (!session) return new NextResponse("Unauthorized", { status: 401 })

        const userSaved = await db.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!userSaved) return new NextResponse("Not found", { status: 404 })


        if (values.email) {
            if (values.email !== userSaved.email) {
                const result = await db.user.findFirst({
                    where: {
                        email: values.email,
                        active: true,
                    }
                })
                if (result) return new NextResponse("Email ya se encuentra registrado en una empresa activa", { status: 400 })
            }
        }


        const userUpdated = await db.user.update({
            where: {
                id: userId,
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(userUpdated)

    } catch (error) {
        console.log("[USER_PATCH_ID]", error)
        return new NextResponse("Internal Errorr" + error, { status: 500 })
    }
}