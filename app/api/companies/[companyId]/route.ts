
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";

export async function PATCH(req: Request, { params }: { params: { companyId: string } }) {
  const session = await getServerSession(authOptions);
  try {
    const values = await req.json();

    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    const existingCompany = await db.company.findUnique({
      where: { id: params.companyId, active: true },
    });


    if (!existingCompany) {
      return new NextResponse("Empresa no encontrada", {
        status: 400,
      });
    }

    const company = await db.company.update({
      where: {
        id: params.companyId
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.log("[COMPANY-CREATE]", error);
    return new NextResponse("Internal Errorr" + error, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { companyId: string } }) {

  try {
    const session = await getServerSession(authOptions)
    const { companyId } = params;

    if (!session) return new NextResponse("Unauthorized", { status: 401 })
    if (!companyId) return new NextResponse("Not Found", { status: 404 })

    const companyDeleted = await db.company.update({
      where: {
        id: companyId,
      },
      data: {
        active: false
      }
    })

    return NextResponse.json(companyDeleted)

  } catch (error) {
    console.log("[DELETED_ID_COMPANY]", error)
    return new NextResponse("Internal Errorr " + error, { status: 500 })
  }
}
