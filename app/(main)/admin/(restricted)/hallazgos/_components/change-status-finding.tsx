"use client";

import { useLoading } from "@/components/providers/loading-provider";
import { SimpleModal } from "@/components/simple-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadImageForm } from "@/components/upload-image-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const ChangeStatusFinding = ({
  id,
  status,
  disabled,
}: {
  id: string;
  status: "OPEN" | "CLOSED" | "CANCELED";
  disabled?: boolean;
}) => {
  const { setLoadingApp } = useLoading();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showModalEvidence, setShowModalEvidence] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<
    "OPEN" | "CLOSED" | "CANCELED" | null
  >(null);

  const onChange = async (e: string) => {
    if (e === "CLOSED") {
      setPendingStatus("CLOSED");
      setShowModal(true);
    } else {
      setLoadingApp(true);
      try {
        await axios.patch(`/api/finding-report/${id}`, { status: e });
        toast.info("Estado cambiado correctamente");
        router.refresh();
      } catch (error) {
        toast.error("Ocurrió un error");
      } finally {
        setLoadingApp(false);
      }
    }
  };


  const handleConfirm = (confirm: boolean) => {
    setShowModal(false);
    if (confirm) {
      setShowModalEvidence(true);
    } else if (pendingStatus) {
      setLoadingApp(true);
      axios
        .patch(`/api/finding-report/${id}`, { status: pendingStatus })
        .then(() => {
          toast.info("Estado cambiado correctamente");
          router.refresh();
        })
        .catch(() => {
          toast.error("Ocurrió un error");
        })
        .finally(() => {
          setLoadingApp(false);
        });
    }
    setPendingStatus(null);
  };

  const handleUploadComplete = () => {
    setShowModalEvidence(false);
    setLoadingApp(true);
    axios
      .patch(`/api/finding-report/${id}`, { status: "CLOSED" })
      .then(() => {
        toast.info("Estado cambiado y evidencia subida correctamente");
        router.refresh();
      })
      .catch(() => {
        toast.error("Ocurrió un error al subir la evidencia");
      })
      .finally(() => {
        setLoadingApp(false);
      });
  };

  return (
    <div className="flex flex-col">
      <span className="font-bold text-sm">Estado: </span>
      <Select
        defaultValue={status}
        onValueChange={(e) => onChange(e)}
        disabled={disabled}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="OPEN">ABIERTO</SelectItem>
          <SelectItem value="CLOSED">CERRADO</SelectItem>
          <SelectItem value="CANCELED">CANCELADO</SelectItem>
        </SelectContent>
      </Select>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              ¿Desea subir evidencia fotográfica?
            </h2>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                onClick={() => handleConfirm(false)}
              >
                No
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => handleConfirm(true)}
              >
                Sí
              </button>
            </div>
          </div>
        </div>
      )}

      <SimpleModal
        title="Subir imagen"
        openDefault={showModalEvidence}
        onClose={handleUploadComplete}
        onAcept={handleUploadComplete}
      >
        <div>
          <UploadImageForm
            apiUrl="/api/upload/file"
            field="closingEvidence"
            file={``}
            label="Evidencia de cierre"
            ubiPath="control/images"
            update={`/api/finding-report/${id}/`}
          />
        </div>
      </SimpleModal>
    </div>
  );
};
