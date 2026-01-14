import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateName = (name) => {
    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (touched[name]) {
      const error =
        name === "email"
          ? validateEmail(value)
          : name === "password"
          ? validatePassword(value)
          : validateName(value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error =
      name === "email"
        ? validateEmail(value)
        : name === "password"
        ? validatePassword(value)
        : validateName(value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameError = validateName(form.name);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);

    if (nameError || emailError || passwordError) {
      setErrors({ name: nameError, email: emailError, password: passwordError });
      setTouched({ name: true, email: true, password: true });
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.register(form);
      navigate("/login");
    } catch (err) {
      setErrors({
        submit: err.response?.data?.error || "Signup failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-950 flex overflow-hidden">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute top-16 left-16 w-56 h-56 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-16 right-16 w-72 h-72 bg-cyan-600/20 rounded-full blur-3xl animate-pulse-slower"></div>
        
        <div className="w-full max-w-sm relative z-10 scale-90">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 mb-4 shadow-lg shadow-purple-500/50">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1.5 tracking-tight">Create account</h1>
            <p className="text-gray-400 text-sm">Get started with your new workspace</p>
          </div>

          {errors.submit && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
              <div className="flex items-start">
                <svg className="w-4 h-4 text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-red-400 font-medium">{errors.submit}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`w-4 h-4 transition-colors ${errors.name && touched.name ? 'text-red-400' : 'text-gray-500 group-focus-within:text-purple-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={` autofill-dark w-full bg-gray-900/50 backdrop-blur-sm border-2 ${
                    errors.name && touched.name 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-gray-800 focus:border-purple-500'
                  } rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all duration-300 focus:bg-gray-900/80 focus:ring-4 ${
                    errors.name && touched.name ? 'focus:ring-red-500/20' : 'focus:ring-purple-500/20'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && touched.name && (
                <p className="text-[10px] text-red-400 font-medium flex items-center mt-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`w-4 h-4 transition-colors ${errors.email && touched.email ? 'text-red-400' : 'text-gray-500 group-focus-within:text-purple-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`autofill-dark w-full bg-gray-900/50 backdrop-blur-sm border-2 ${
                    errors.email && touched.email 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-gray-800 focus:border-purple-500'
                  } rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all duration-300 focus:bg-gray-900/80 focus:ring-4 ${
                    errors.email && touched.email ? 'focus:ring-red-500/20' : 'focus:ring-purple-500/20'
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && touched.email && (
                <p className="text-[10px] text-red-400 font-medium flex items-center mt-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`w-4 h-4 transition-colors ${errors.password && touched.password ? 'text-red-400' : 'text-gray-500 group-focus-within:text-purple-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={` autofill-dark w-full bg-gray-900/50 backdrop-blur-sm border-2 ${
                    errors.password && touched.password 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-gray-800 focus:border-purple-500'
                  } rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all duration-300 focus:bg-gray-900/80 focus:ring-4 ${
                    errors.password && touched.password ? 'focus:ring-red-500/20' : 'focus:ring-purple-500/20'
                  }`}
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-purple-400 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="text-[10px] text-red-400 font-medium flex items-center mt-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-5 relative group overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 p-0.5 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="relative bg-gradient-to-r from-purple-600 to-cyan-600 rounded-[7px] px-5 py-2.5 flex items-center justify-center font-semibold text-sm text-white transition-all duration-300 group-hover:bg-none">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </div>
            </button>
          </form>

          <p className="mt-5 text-center text-gray-400 text-xs">
            Already have an account?{" "}
            <a href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-purple-500 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-cyan-500 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-500 rounded-full animate-float-slow"></div>
        
        <div className="relative z-10 flex flex-col justify-center p-12 max-w-xl scale-90">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-3 leading-tight">
              Retrieval Augmented
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Generation
              </span>
            </h2>
            <p className="text-base text-gray-400 leading-relaxed">
              Enhancing AI responses with real-time knowledge retrieval for accurate, contextual answers
            </p>
          </div>

          <div className="space-y-4">
            <div className="group relative">
              <div className="flex items-start space-x-3 p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:bg-gray-800/50">
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-purple-300 transition-colors">Retrieval</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">Query relevant documents from your knowledge base using semantic search and vector embeddings</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-0.5 h-6 bg-gradient-to-b from-purple-500/50 to-cyan-500/50"></div>
            </div>

            <div className="group relative">
              <div className="flex items-start space-x-3 p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:bg-gray-800/50">
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">Augmentation</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">Combine retrieved context with user query to create an enriched prompt with relevant information</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-500/50 to-pink-500/50"></div>
            </div>

            <div className="group relative">
              <div className="flex items-start space-x-3 p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 hover:bg-gray-800/50">
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/50 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-pink-300 transition-colors">Generation</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">AI model generates accurate, contextual responses based on retrieved knowledge and user intent</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl"></div>
      </div>

      <style jsx>{`
       .autofill-dark:-webkit-autofill,
        .autofill-dark:-webkit-autofill:hover,
        .autofill-dark:-webkit-autofill:focus,
        .autofill-dark:-webkit-autofill:active {
          -webkit-background-clip: text;
          -webkit-text-fill-color: #ffffff;
          transition: background-color 5000s ease-in-out 0s;
          box-shadow: inset 0 0 20px 20px rgba(17, 24, 39, 0.5);
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.08); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}