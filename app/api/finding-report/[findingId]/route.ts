
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";

export async function PATCH(req: Request, { params }: { params: { findingId: string } }) {
  const session = await getServerSession(authOptions);
  try {
    const values = await req.json();

    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    const existingFindingReport = await db.findingReport.findUnique({
      where: { id: params.findingId, active: true },
    });

    console.log({values})


    if (!existingFindingReport) {
      return new NextResponse("Empresa no encontrada", {
        status: 400,
      });
    }

    const findingReport = await db.findingReport.update({
      where: {
        id: existingFindingReport.id
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(findingReport);
  } catch (error) {
    console.log("[FINDING-REPORT-PATCH]", error);
    return new NextResponse("Internal Errorr" + error, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { contractorId: string } }) {

  try {
    const session = await getServerSession(authOptions)
    const { contractorId } = params;

    if (!session) return new NextResponse("Unauthorized", { status: 401 })
    if (!contractorId) return new NextResponse("Not Found", { status: 404 })

    const contractorDeleted = await db.contractor.update({
      where: {
        id: contractorId,
      },
      data: {
        active: false
      }
    })

    return NextResponse.json(contractorDeleted)

  } catch (error) {
    console.log("[DELETED_ID_FINDING_REPORT]", error)
    return new NextResponse("Internal Errorr " + error, { status: 500 })
  }
}
