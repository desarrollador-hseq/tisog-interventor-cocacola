import { NextResponse } from "next/server";
import { ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, endpoint } from "@/lib/s3-client";

import { v4 as uuid } from "uuid"

export async function POST(req: Request) {
    try {
        const data = await req.formData()
        const file = data.get("file") as File
        const ubiPath = data.get("ubiPath") as string
        const extValid = ["jpeg", "jpg", "png", "pdf"]
        const bucket = process.env.DO_BUCKET || "grupohseq"
        if (!file) return new NextResponse("No ha subido ningun archivo", { status: 400 })
        const fileExt = file.name.split(".").pop()?.toLowerCase()
        const isValid = extValid.some(f => f == fileExt)
        if (!isValid) return new NextResponse("Archivo no es válido", { status: 400 })

        const maxSize = 1000000; // 1 MB
        const fileSize = file.size;

        if (fileSize > maxSize) return new NextResponse("El archivo es demasiado grande", { status: 400 });

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        let result = null;

        const bucketParams = {
            Bucket: bucket,
            Key: ubiPath ? `tsg-int-cc/${ubiPath}/${uuid()}.${fileExt}` : `tsg-int-cc/${uuid()}.${fileExt}`,
            Body: buffer,
            ACL: ObjectCannedACL.public_read,
            ContentType: file.type
        }

        try {
            result = await s3Client.send(new PutObjectCommand(bucketParams))
        } catch (error) {
            return new NextResponse("Error al cargar archivos en la nube - do: " + error, { status: 400 })
        }

        return NextResponse.json({
            id: result.ETag,
            url: `${endpoint}/${bucket}/${bucketParams.Key}`
        })
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Errorr: " + error, { status: 500 })
    }
}
