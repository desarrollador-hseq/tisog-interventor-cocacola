import { db } from "@/lib/db";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { DeleteUser } from "../_components/delete-user";
import { AddUserForm } from "../_components/add-user-form";

const bcrumb = [
  { label: "Usuarios", path: "/admin/usuarios" },
  { label: "Editar", path: "/admin/editar" },
];

const EditUserPage = async ({
  params,
}: {
  params: { userId: string };
}) => {
  const user = await db.user.findUnique({
    where: {
      active: true,
      id: params.userId,
    },
  });


  if (!user) {
    return <CardPage>Usuario no encontrado</CardPage>;
  }

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Editar usuario" bcrumb={bcrumb}>
          <DeleteUser user={user} />
        </TitleOnPage>
      }
    >
      <AddUserForm user={user} />
    </CardPage>
  );
};

export default EditUserPage;
