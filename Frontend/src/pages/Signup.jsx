import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password.length > 50) return "Password must be less than 50 characters";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (error) setError("");

    if (touched[name]) {
      const validationError =
        name === "email" ? validateEmail(value) : validatePassword(value);
      setValidationErrors({ ...validationErrors, [name]: validationError });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    const validationError =
      name === "email" ? validateEmail(value) : validatePassword(value);
    setValidationErrors({ ...validationErrors, [name]: validationError });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);

    if (emailError || passwordError) {
      setValidationErrors({
        email: emailError,
        password: passwordError,
      });
      setTouched({ email: true, password: true });
      return;
    }

    setLoading(true);

    try {
      await authAPI.register(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: "", color: "" };
    
    let score = 0;
    if (password.length >= 6) score += 25;
    if (password.length >= 10) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    
    if (score <= 25) return { score: 25, label: "Weak", color: "bg-red-500" };
    if (score <= 50) return { score: 50, label: "Fair", color: "bg-orange-500" };
    if (score <= 75) return { score: 75, label: "Good", color: "bg-yellow-500" };
    return { score: 100, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-10 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-6 relative z-10 animate-fadeIn">
        {/* Logo & Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-5">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative h-14 w-14 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent animate-slideDown mb-2">
            Create Account
          </h2>
          <p className="text-sm text-gray-600 animate-slideDown font-medium" style={{ animationDelay: "0.1s" }}>
            Start your journey with us today
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-xl py-7 px-5 sm:px-8 shadow-2xl rounded-2xl border border-white/20 transform hover:shadow-3xl transition-all duration-500 hover:scale-[1.01]">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Server Error Alert */}
            {error && (
              <div className="rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-3.5 animate-shake">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="group transform transition-all duration-300 hover:scale-[1.01]">
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg
                    className={`h-5 w-5 transition-all duration-300 ${
                      touched.email && !validationErrors.email
                        ? "text-green-500 scale-110"
                        : "text-gray-400 group-hover:text-purple-500"
                    }`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none block w-full pl-11 pr-11 py-2.5 border-2 ${
                    validationErrors.email && touched.email
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : touched.email && !validationErrors.email
                      ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                      : "border-gray-200 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300"
                  } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 text-sm font-medium bg-white/50 hover:bg-white`}
                />
                {touched.email && !validationErrors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-green-500 animate-scaleIn"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {validationErrors.email && touched.email && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center animate-slideDown font-medium">
                  <svg
                    className="h-3.5 w-3.5 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="group transform transition-all duration-300 hover:scale-[1.01]">
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg
                    className={`h-5 w-5 transition-all duration-300 ${
                      touched.password && !validationErrors.password
                        ? "text-green-500 scale-110"
                        : "text-gray-400 group-hover:text-purple-500"
                    }`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none block w-full pl-11 pr-11 py-2.5 border-2 ${
                    validationErrors.password && touched.password
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : touched.password && !validationErrors.password
                      ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                      : "border-gray-200 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300"
                  } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 text-sm font-medium bg-white/50 hover:bg-white`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center hover:scale-110 transition-transform duration-200 group/btn"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-400 group-hover/btn:text-purple-600 transition-colors duration-200"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400 group-hover/btn:text-purple-600 transition-colors duration-200"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {validationErrors.password && touched.password && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center animate-slideDown font-medium">
                  <svg
                    className="h-3.5 w-3.5 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {validationErrors.password}
                </p>
              )}
              
              {/* Password Strength Indicator */}
              {form.password && (
                <div className="mt-2 animate-fadeIn">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-700">Password Strength</span>
                    <span className={`text-xs font-bold ${
                      passwordStrength.score === 25 ? 'text-red-500' :
                      passwordStrength.score === 50 ? 'text-orange-500' :
                      passwordStrength.score === 75 ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.score}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 px-4 overflow-hidden text-sm font-bold rounded-xl text-white bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 active:scale-95 disabled:transform-none disabled:shadow-lg"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                {loading ? (
                  <span className="flex items-center relative z-10">
                    <svg
                      className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating your account...
                  </span>
                ) : (
                  <span className="flex items-center relative z-10">
                    <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Create Account
                    <svg
                      className="ml-2 -mr-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white/80 text-gray-500 font-semibold">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Sign Up Buttons */}
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              <button
                type="button"
                className="group w-full inline-flex justify-center py-2 px-3 border-2 border-gray-200 rounded-xl shadow-sm bg-white/50 hover:bg-white text-sm font-medium text-gray-500 hover:border-purple-300 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>

              <button
                type="button"
                className="group w-full inline-flex justify-center py-2 px-3 border-2 border-gray-200 rounded-xl shadow-sm bg-white/50 hover:bg-white text-sm font-medium text-gray-700 hover:border-purple-300 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="group w-full inline-flex justify-center py-2 px-3 border-2 border-gray-200 rounded-xl shadow-sm bg-white/50 hover:bg-white text-sm font-medium text-gray-500 hover:border-purple-300 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0C4.477 0 0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.879V12.89h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.989C16.343 19.128 20 14.991 20 10c0-5.523-4.477-10-10-10z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-700 animate-fadeIn font-medium" style={{ animationDelay: "0.2s" }}>
          Already have an account?{" "}
          <a
            href="/login"
            className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 hover:underline"
          >
            Sign in
          </a>
        </p>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 animate-fadeIn max-w-sm mx-auto" style={{ animationDelay: "0.3s" }}>
          By creating an account, you agree to our{" "}
          <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200 hover:underline">
            Terms
          </a>
          {" "}and{" "}
          <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes tilt {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(180deg);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.5s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-tilt {
          animation: tilt 10s infinite linear;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}