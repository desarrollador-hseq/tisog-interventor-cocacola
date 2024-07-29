import { useLoading } from "@/components/providers/loading-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const ReleasePermit = ({
  disabled,
  controlId,
  permission,
}: {
  disabled?: boolean;
  permission: boolean;
  controlId: string;
}) => {
  const { setLoadingApp } = useLoading();
  const router = useRouter();

  const onChange = async (e: string) => {
    setLoadingApp(true);
    try {
      await axios.patch(`/api/controls/${controlId}`, {
        releasePermit: e === "1" ? true : false,
      });

      // toast.info("nivel de criticidad cambiado correctamente");
      router.refresh();
    } catch (error) {
      toast.error("Ocurrió un error");
    } finally {
      setLoadingApp(false);
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <span className="font- text-base ">
        ¿La actividad cuenta con la liberación de los permisos y formatos por
        parte del interventor del área?
      </span>
      <Select
        defaultValue={permission ? "1" : "0"}
        onValueChange={(e) => onChange(e)}
        disabled={disabled}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Sí</SelectItem>
          <SelectItem value="0">No</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
