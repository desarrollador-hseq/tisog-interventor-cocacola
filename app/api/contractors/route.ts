import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    try {
      const values = await req.json();
  
     if(!session) return new NextResponse("Unauthorized", {status: 401})
  
      const existingContractor= await db.contractor.findFirst({
        where: { nit: values.nit, active: true },
      });
  
      if (existingContractor) {
        return new NextResponse("NIT ya registrado en otro contratista", {
          status: 400,
        });
      }
  
      const contractor = await db.contractor.create({
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
  