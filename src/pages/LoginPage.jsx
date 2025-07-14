import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const {
    loginWithGoogle,
    registerWithEmail,
    loginWithEmail,
    resendVerificationEmail,
    logout
  } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        const userCredential = await registerWithEmail(email, password);
        alert("A verification email has been sent. Please verify your email before logging in.");
        setIsRegister(false);
        clearFields();
        return;
      } else {
        const userCredential = await loginWithEmail(email, password);

        await userCredential.user.reload();

        if (!userCredential.user.emailVerified) {
          await logout();
          setError("Please verify your email before logging in. Check your inbox and spam folder.");
          return;
        }

        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResend = async () => {
    try {
      const userCredential = await loginWithEmail(email, password);

      await userCredential.user.reload();

      if (!userCredential.user.emailVerified) {
        await resendVerificationEmail();
        alert("Verification email resent. Please check your inbox and spam folder.");
      } else {
        setError("Your email is already verified. You can log in.");
      }
    } catch (err) {
      setError("Failed to resend verification email. Check your email and password.");
    }
  };

  const handleIsRegister = () => {
    setIsRegister(!isRegister);
    clearFields();
  };

  const clearFields = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  return (
    <div className="py-6 px-4 lg:px-84 mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">{isRegister ? "Register" : "Login"}</h1>
      <div className="bg-[#1e1e1e] rounded shadow space-y-4 p-4">

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        {error.includes("verify your email") && (
          <div className="text-center">
            <button
              className="text-blue-500 hover:underline cursor-pointer text-sm"
              onClick={handleResend}
            >
              Resend verification email
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            className="w-full p-2 rounded bg-[#121212] border border-[#333333] focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="w-full p-2 rounded bg-[#121212] border border-[#333333] focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isRegister && (
            <input
              type="password"
              required
              placeholder="Re-enter Password"
              className="w-full p-2 rounded bg-[#121212] border border-[#333333] focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-500 px-4 py-2 rounded text-white font-semibold hover:bg-blue-600"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div className="my-4 text-center">
          <button
            onClick={handleGoogle}
            className="w-full cursor-pointer bg-gray-500 px-4 py-2 rounded text-white font-semibold hover:bg-gray-600"
          >
            Continue with Google
          </button>
        </div>

        <p className="text-center text-sm mt-4">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => handleIsRegister()}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}