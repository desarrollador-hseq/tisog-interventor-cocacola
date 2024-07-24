import React, { useState, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import {
  Cloud,
  ImageIcon,
  Loader2,
  Pencil,
  PlusCircle,
  UploadCloud,
} from "lucide-react";
import { Form } from "./ui/form";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";
import Compressor from "compressorjs";
// Ajusta las importaciones según tu proyecto
const MAX_FILE_SIZE = 10024 * 10024 * 1; // 1MB
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const formSchema = z.object({
  file: z
    .any()
    .refine((file) => file?.length !== 0, "File is required")
    .refine((files) => {
      return files?.size <= MAX_FILE_SIZE;
    }, `El tamaño máximo del archivo es de 1MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.type),
      "Solo los formatos de .jpg, .jpeg, y .png son aceptados"
    ),
});

interface fileFormProps {
  file: string | null;
  apiUrl: string;
  field: string;
  update: string;
  defaultOpenUpload?: boolean;
  ubiPath: string;
  label: string;
}

export const UploadImageForm = ({
  file,
  apiUrl,
  field,
  update,
  ubiPath,
  label,
  defaultOpenUpload = false,
}: fileFormProps) => {
  const [isEditing, setIsEditing] = useState(defaultOpenUpload);
  const [isUploading, setIsUploading] = useState<boolean | null>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const router = useRouter();

  const toggleEdit = () => {
    setSelectedFile(null);
    setIsEditing((current) => !current);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      compressImage(acceptedFiles[0]);
    },
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
  });

  useEffect(() => {
    if (selectedFile) {
      setValue("file", selectedFile, { shouldValidate: true });
    }
  }, [selectedFile]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: file || undefined,
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const { setValue } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", values.file);
    formData.append("ubiPath", ubiPath);

    const progressInterval = startSimulatedProgress();
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const { data } = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await axios.patch(update, { [field]: data.url });

      toast.success("Imagen actualizado");
      setUploadProgress(100);
      toggleEdit();
      router.refresh();
    } catch (e) {
      toast.error(
        "Ocurrió un error inesperado, por favor inténtelo nuevamente"
      );
    } finally {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  const compressImage = (file: File) => {
    new Compressor(file, {
      quality: 0.6, // (0.6 = 60%)
      success: (compressedBlob) => {
        // Convertir el Blob comprimido a un File
        const compressedFile = new File([compressedBlob], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });
        setSelectedFile(compressedFile);
      },
      error: (err) => {
        console.error("Error al comprimir la imagen:", err);
        toast.error(
          "Error al comprimir la imagen, por favor intente de nuevo."
        );
      },
    });
  };

  const startSimulatedProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 200);

    return interval;
  };

  return (
    <Card className="bg-slate-200 rounded-md p-1 border border-primary/20  overflow-hidden">
      <CardHeader className="max-h-[200px] bg-slate-100 rounded-sm shadow-sm border border-slate-300">
        <div className="font-medium flex items-center justify-between flex-row md:flex-col md:gap-3 lg:flex-row">
          <h3 className="font-semibold text-lg text-primary/80 ml-2">
            {label}
          </h3>

          {!isEditing && (
            <Button
              onClick={toggleEdit}
              variant="secondary"
              className={cn(
                "text-white mr-2",
                isEditing && "bg-slate-500 hover:bg-slate-700"
              )}
            >
              {file && !isEditing ? (
                "Cambiar"
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Agregar
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex items-start">
        {!isEditing &&
          (!file ? (
            <div className="flex  flex-col items-center justify-center h-60 bg-slate-200 rounded-md w-full italic text-slate-400">
              <ImageIcon className="w-10 h-10 text-slate-500" />
              Sin imagen
            </div>
          ) : (
            <div className="mt-2 min-w-full flex justify-center w-full">
              <div className="object-cover ">
                {!!file && file !== "null" ? (
                  <Image
                    src={file}
                    alt=""
                    width={400}
                    height={400}
                    style={{
                      width: 400,
                      height: "auto",
                      maxHeight: 400,
                      maxWidth: 400,
                    }}
                  />
                ) : (
                  <div className="py-6 font-semibold">Sin imagen</div>
                )}
              </div>
            </div>
          ))}
        {isEditing && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={"flex flex-col items-center mt-2 p-1 w-full"}
            >
              <div className="w-full flex flex-col items-center">
                <div
                  {...getRootProps()}
                  className={"dropzone w-full bg-secondary/60"}
                  style={{
                    // background: "#4e71b185",
                    borderRadius: "7px",
                    border: selectedFile ? "" : "3px dashed #4e71b1",
                    color: "white",
                    marginBottom: "1rem",
                  }}
                >
                  <div className="flex flex-col items-center justify-center pb-6 mb-3 w-full">
                    {uploadProgress !== 100 ? (
                      <div className="min-h-[100px] max-w-max flex flex-col gap-3 items-center justify-center w-full">
                        {selectedFile ? (
                          <div className="flex max-w-max bg-secondary items-center justify-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200 p-4">
                            <div className=" max-w-[200px] max-h-[200px] flex bg-secondary items-center justify-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200 p-4">
                              <div className="px-3 py-2 h-full flex flex-col items-center">
                                <Image
                                  src={URL.createObjectURL(selectedFile)}
                                  alt={selectedFile.name}
                                  width={100}
                                  height={100}
                                  objectFit="cover"
                                />
                                <span className="text-xs font-semibold text-slate-300 italic">
                                  {" "}
                                  Tipo: {selectedFile.type.split("/").pop()}
                                </span>
                              </div>
                              <p className="px-3 py-2 h-full text-sm truncate text-white font-semibold  text-ellipsis">
                                {selectedFile.name}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Cloud className="h-10 w-10 text-white mb-2" />
                            <p className="mb-2 text-sm text-white">
                              <span className="font-semibold text-base">
                                Click para subir
                              </span>{" "}
                              o arrastra el archivo aquí
                            </p>
                            <p className="text-sm text-zinc-200">
                              Formatos aceptados: jpg, jpeg, png
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="mb-2 text-sm font-semibold flex flex-col items-center text-emerald-300">
                        <UploadCloud className="w-16 h-16" />
                        Archivo subido correctamente
                      </p>
                    )}
                  </div>

                  {!!uploadProgress && (
                    <Progress
                      indicatorColor={
                        uploadProgress === 100 ? "bg-green-300" : ""
                      }
                      value={uploadProgress}
                      className="h-1 w-full bg-zinc-200"
                    />
                  )}

                  <input {...getInputProps()} />
                  {!selectedFile && isDragActive && (
                    <p>Haga clic o arrastre un archivo para cargarlo</p>
                  )}
                </div>

                {/* <label
                    htmlFor="file-input"
                    className="mb-2 w-full text-center"
                  >
                    <Button
                      onClick={handleButtonClick}
                      className="w-full py-7"
                      variant="secondary"
                    >
                      Tomar Foto
                    </Button>
                    <input
                      ref={fileInputRef}
                      id="file-input"
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                        }
                      }}
                      style={{ display: "none" }}
                    />
                  </label> */}

                <Button
                  disabled={isSubmitting || !isValid}
                  className={`w-full max-w-full gap-3 mt-2 ${
                    !selectedFile && "hidden"
                  }`}
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {selectedFile && (isEditing && file ? "Cambiar" : "Subir")}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};
