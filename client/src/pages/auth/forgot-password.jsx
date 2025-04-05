import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { forgotPassword } from "@/store/authSlice"; // Import the action
import CommonForm from "@/components/common/form.jsx";

const initialState = {
  email: "",
};

function AuthForgotPassword() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  async function onSubmit(event) {
    event.preventDefault();
    const result = await dispatch(forgotPassword(formData.email)); // Dispatch action
    if (result?.payload?.success) {
      toast({ title: "Password reset email sent!" });
      navigate("/auth/login"); // Redirect after success
    } else {
      toast({
        title: result?.payload?.message || "Failed to send reset email",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <h1 className="text-3xl font-bold text-center">Forgot Password?</h1>
      <p className="text-center text-sm text-gray-600">
        Enter your email and we'll send you instructions to reset your password.
      </p>
      <CommonForm
        formControls={[
          {
            name: "email",
            label: "Email Address",
            componentType: "input",
            type: "email",
            placeholder: "Enter your email",
          },
        ]}
        buttonText="Send Reset Link"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthForgotPassword;
