
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)


    try {
        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        const { message } = await req.json()

        if (!message) return new NextResponse("Not Found", { status: 400 })

        const adminsAndViewers = await db.user.findMany({
            where: {
                role: {
                    in: ["ADMIN", "VIEWER"],
                },
                active: true,
                receiveNotifications: true,
            },
        })


        for (let index = 0; index < adminsAndViewers.length; index++) {
            const admin = adminsAndViewers[index];
            try {
                if (!!admin.phone) {
                    console.log(JSON.stringify(admin))
                    const { data } = await axios.get('https://api.labsmobile.com/get/send.php', {
                        params: {
                            username: process.env.LABSMOBILEUSERNAME,
                            password: process.env.LABSMOBILETOKEN,
                            msisdn: admin.phone,
                            message: message,
                        },
                    })
                    console.log({dataSMS: data})
                }

            } catch (error) {
                return new NextResponse("Error al enviar el sms con el link, por favor intentelo nuevamente" + error, { status: 400 });
            }
        }

        return NextResponse.json({ ok: true })

    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Errorr", { status: 500 })
    }
}