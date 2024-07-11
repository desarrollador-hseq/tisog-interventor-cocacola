
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";

export async function GET(req: Request, { params }: { params: { areasId: string } }) {
  try {


    const area = await db.businessAreas.findUnique({
      where: {
        id: params.areasId,
      }
    })

    return NextResponse.json(area);
  } catch (error) {
    console.log("[areas-GET]", error);
    return new NextResponse("Internal Errorr" + error, { status: 500 });
  }

}


export async function PATCH(req: Request, { params }: { params: { areasId: string } }) {
  const session = await getServerSession(authOptions);
  try {
    const values = await req.json();

    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    const existingArea = await db.businessAreas.findUnique({
      where: { id: params.areasId, active: true },
    });


    if (!existingArea) {
      return new NextResponse("Área no encontrada", {
        status: 400,
      });
    }

    const area = await db.businessAreas.update({
      where: {
        id: params.areasId
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(area);
  } catch (error) {
    console.log("[AREA-EDIT]", error);
    return new NextResponse("Internal Errorr" + error, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { areasId: string } }) {

  try {
    const session = await getServerSession(authOptions)
    const { areasId } = params;

    if (!session) return new NextResponse("Unauthorized", { status: 401 })
    if (!areasId) return new NextResponse("Not Found", { status: 404 })

    const areaDeleted = await db.businessAreas.update({
      where: {
        id:  areasId,
      },
      data: {
        active: false
      }
    })

    return NextResponse.json(areaDeleted)

  } catch (error) {
    console.log("[DELETED_ID_CONTRACTOR]", error)
    return new NextResponse("Internal Errorr " + error, { status: 500 })
  }
}
