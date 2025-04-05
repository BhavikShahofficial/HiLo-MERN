import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../ui/select";
import { Button } from "../ui/button";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  forgetPassword, // Accepts a URL or a function
}) {
  function renderInputByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                [getControlItem.name]: event.target.value,
              }))
            }
          />
        );
        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                [getControlItem.name]: value,
              }))
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options?.map((optionItem) => (
                <SelectItem key={optionItem.id} value={optionItem.id}>
                  {optionItem.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            value={value}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                [getControlItem.name]: event.target.value,
              }))
            }
          />
        );
        break;
      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                [getControlItem.name]: event.target.value,
              }))
            }
          />
        );
        break;
    }
    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputByComponentType(controlItem)}
          </div>
        ))}

        {/* Forgot Password Link */}
        {forgetPassword && (
          <div className="text-right mt-2">
            {typeof forgetPassword === "string" ? (
              <a
                href={forgetPassword}
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot Password?
              </a>
            ) : (
              <button
                type="button"
                className="text-sm text-blue-500 hover:underline"
                onClick={forgetPassword}
              >
                Forgot Password?
              </button>
            )}
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" className="mt-2 w-full" disabled={isBtnDisabled}>
          {buttonText || "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default CommonForm;
