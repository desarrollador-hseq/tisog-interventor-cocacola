import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transporter, mailOptions } from "@/lib/nodemailer";


export async function POST(req: Request,
    { params }: { params: { findingId: string } }) {

    try {
        const baseUrl = process.env.NEXTAUTH_URL
        const values = await req.json()


        const existingFinding = await db.findingReport.findUnique({
            where: { id: params.findingId, NOT: { status: "CANCELED" } },

        });

        if (!existingFinding) {
            return new NextResponse("Hallazgo no fue encontrado", { status: 400 });
        }

        const admins = await db.user.findMany({
            where: {
                role: "ADMIN",
                active: true,
                receiveNotifications: true
            }
        })


        const link = `${baseUrl}/admin/hallazgos/${existingFinding.id}`
        const generateEmailContent = () => {

            return {
                text: `Se ha generado un nuevo hallazgo de nivel: ${existingFinding.findingLevel === "HIGH" ? "ALTO" : existingFinding.findingLevel === "MEDIUM" ? "MEDIO" : "BAJO"}. Puede revisarlo en el siguiente enlace: ${link}`,
                html: ``,
            };
        };

        for (let index = 0; index < admins.length; index++) {
            const admin = admins[index];
            try {
                await transporter.sendMail({
                    ...mailOptions,
                    to: admin.email!,
                    ...generateEmailContent(),
                    subject: `Nuevo Hallazgo Generado: Nivel ${existingFinding.findingLevel === "HIGH" ? "ALTO" : existingFinding.findingLevel === "MEDIUM" ? "MEDIO" : "BAJO"}`,
                });

            } catch (error) {
                return new NextResponse("Error al enviar el correo con el link, por favor intentelo nuevamente" + error, { status: 400 });
            }


        }

        return NextResponse.json({ok: true})

    } catch (error) {
        console.log("[MAIL-FINDING-REPORT-LEVEL]", error)
        return new NextResponse("Internal Errorr" + error, { status: 500 })
    }
}
