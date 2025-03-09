import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../ui/data-table";
import { Button } from "../../ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { User } from "../../../../generated/prisma_client";

interface AgentsProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  user: User;
}

const Agents = <TData, TValue>({
  columns,
  data,
  user,
}: AgentsProps<TData, TValue>) => {
  return (
    <div className="mx-5">
      <div className="mb-4">
        {user.role === "ADMIN" && (
          <div className="justify-start my-4">
            <Button variant="default" className="ml-auto justify-start" asChild>
              <Link href="agents/form">
                <Plus className="h-4 w-4 mr-2 cursor-pointer" />
                New Agen
              </Link>
            </Button>
          </div>
        )}

        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Agents;
