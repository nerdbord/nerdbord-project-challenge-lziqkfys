import {
  useFieldArray,
} from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import TrashIcon from "../icons/TrashIcon";

interface OptionsFieldArrayProps {
  control: any;
  index: number;
}

function OptionsFieldArray({ control, index }: OptionsFieldArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `formData.${index}.options`,
  });

  return (
    <div>
      {fields.map((option, j) => (
        <div key={j} className="flex items-center">
          <FormField
            control={control}
            name={`formData.${index}.options.${j}.option`}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Option"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div onClick={() => remove(j)}>
            <TrashIcon />
          </div>
        </div>
      ))}

      <Button variant="outline" type="button" onClick={() => append("")}>
        Add Option
      </Button>
    </div>
  );
}

export default OptionsFieldArray;
