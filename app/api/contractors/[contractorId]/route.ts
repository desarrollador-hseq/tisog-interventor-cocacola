
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";

export async function GET(req: Request, { params }: { params: { contractorId: string } }) {
  try {


    const contractor = await db.contractor.findUnique({
      where: {
        id: params.contractorId,
      }
    })

    return NextResponse.json(contractor);
  } catch (error) {
    console.log("[CONTRACTOR-GET]", error);
    return new NextResponse("Internal Errorr" + error, { status: 500 });
  }

}
export async function PATCH(req: Request, { params }: { params: { contractorId: string } }) {
  const session = await getServerSession(authOptions);
  try {
    const values = await req.json();

    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    const existingContractor = await db.contractor.findUnique({
      where: { id: params.contractorId, active: true },
    });


    if (!existingContractor) {
      return new NextResponse("Empresa no encontrada", {
        status: 400,
      });
    }

    const contractor = await db.contractor.update({
      where: {
        id: params.contractorId
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(contractor);
  } catch (error) {
    console.log("[CONTRACTOR-CREATE]", error);
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
    console.log("[DELETED_ID_CONTRACTOR]", error)
    return new NextResponse("Internal Errorr " + error, { status: 500 })
  }
}
