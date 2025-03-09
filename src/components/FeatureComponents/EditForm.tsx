import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface Props {
  page?: string;
  data: any;
}

export function EditForm({ page, data }: Props) {
  return (
    <>
      {page === "distribution" && (
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="agentName" className="text-right">
              Agent Name
            </Label>
            <Input
              id="agentName"
              defaultValue={data?.agentName}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deliveryNumber" className="text-right">
              Delivery Number
            </Label>
            <Input
              id="deliveryNumber"
              defaultValue={data?.deliveryNumber}
              className="col-span-3"
            />
          </div>
          {/* Add more form fields as needed */}


        </div>
      )}
    </>
  );
}

export default EditForm;
