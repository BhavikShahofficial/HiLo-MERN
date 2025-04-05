import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPassword } from "@/store/authSlice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AuthResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      return setError("Both fields are required.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setIsLoading(true);

    try {
      const result = await dispatch(
        resetPassword({ token, password })
      ).unwrap();

      toast({
        title: "Password reset successful!",
      });

      setTimeout(() => navigate("/auth/login"), 1000);
    } catch (err) {
      toast({
        title: "Reset failed",
        description: err?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Reset Your Password</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleReset}>
        <div className="mb-4">
          <Label className="block mb-1 font-medium">New Password</Label>
          <Input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Label className="block mb-1 font-medium">Confirm Password</Label>
          <Input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
};

export default AuthResetPassword;
