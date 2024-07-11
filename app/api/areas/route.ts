import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    try {
      const values = await req.json();
  
     if(!session) return new NextResponse("Unauthorized", {status: 401})
  
      const existingArea= await db.businessAreas.findFirst({
        where: { name: values.name, active: true },
      });
  
      if (existingArea) {
        return new NextResponse("Área ya se encuentra registrada", {
          status: 400,
        });
      }
  
      const area = await db.businessAreas.create({
        data: {
          ...values,
        },
      });
  
      return NextResponse.json(area);
    } catch (error) {
      console.log("[AREA-CREATE]", error);
      return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
  }
  