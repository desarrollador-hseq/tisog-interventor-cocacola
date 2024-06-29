import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { AddUserForm } from "../_components/add-user-form";

const bcrumb = [
  { label: "Usuarios", path: "/admin/usuarios" },
  { label: "Agregar", path: "/admin/crear" },
];

const CreateUserPage = async () => {
  return (
    <CardPage
      pageHeader={
        <TitleOnPage text={`Agregar usuario`} bcrumb={bcrumb}></TitleOnPage>
      }
    >
      <AddUserForm />
    </CardPage>
  );
};

export default CreateUserPage;
