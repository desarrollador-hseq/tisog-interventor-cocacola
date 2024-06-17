// import { CardPage } from "@/components/card-page";
import { TableDefault } from "@/components/table-default";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { CardPage } from "@/components/card-page";
import { findingReportColumns } from "../../analista/reportes/_components/finding-report-columns";

const bcrumb = [{ label: "Hallazgos", path: "/admin/hallazgos" }];

const FindingReportPage = async () => {


  const findingReports = await db.findingReport.findMany({
    where: {
      active: true,
    },
  });

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Hallazgos" bcrumb={bcrumb}>
          {/* <Link
            className={cn(buttonVariants({ variant: "secondary" }))}
            href={`/admin/analistas/crear`}
          >
            Agregar
          </Link> */}
        </TitleOnPage>
      }
    >
      <TableDefault
        data={findingReports}
        columns={findingReportColumns}
        editHref={{ btnText: "Editar", href: `/admin/hallazgos` }}
      />
    </CardPage>
  );
};

export default FindingReportPage;
