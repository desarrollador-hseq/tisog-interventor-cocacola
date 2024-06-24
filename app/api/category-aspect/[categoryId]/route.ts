import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";



export async function PATCH(req: Request, { params }: { params: { categoryId: string } }) {
    const session = await getServerSession(authOptions);
    try {
        const values = await req.json();

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!params.categoryId) return new NextResponse("Bad request", { status: 400 })
        if (!values.name) return new NextResponse("Bad request", { status: 400 })


        const categorydb = await db.securityCategory.findUnique({
            where: {
                id: params.categoryId
            }
        })

        if (!categorydb) return new NextResponse("Bad request", { status: 400 })

        if (categorydb.name !== values.name) {
            const securityCategoryExist = await db.securityCategory.findFirst({
                where: {
                    name: values.name,
                    active: true,
                }
            })

            if (securityCategoryExist) return new NextResponse("Categoria ya se encuentra registrada", { status: 400 })
        }

        const category = await db.securityCategory.update({
            where: {
                id: params.categoryId
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log("[CATEGORY-ASPECT-UPDATED]", error);
        return new NextResponse("Internal Errorr" + error, { status: 500 });
    }
}


export async function DELETE(req: Request, { params }: { params: { categoryId: string } }) {

    try {
        const session = await getServerSession(authOptions)
        const { categoryId } = params;

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!categoryId) return new NextResponse("Not Found", { status: 404 })

        const categoryDeleted = await db.securityCategory.update({
            where: {
                id: categoryId,
            },
            data: {
                active: false
            }

        })

        return NextResponse.json(categoryDeleted)

    } catch (error) {
        console.log("[DELETED_ID_CATEGORY-ASPECT]", error)
        return new NextResponse("Internal Errorr " + error, { status: 500 })
    }
}
