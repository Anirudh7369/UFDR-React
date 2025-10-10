import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/landing');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="bg-surface-dark/50 dark:bg-surface-dark/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/5">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Login</h1>
            <p className="mt-2 text-muted-dark">Sign in to access your account</p>
          </div>
          <div className="mt-8 space-y-4">
            <button className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-white/10 dark:bg-white/10 hover:bg-white/20 transition-colors duration-300">
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"></path>
                <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"></path>
                <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.655-3.356-11.303-8H6.306C9.656,35.663,16.318,40,24,40V44z" fill="#4CAF50"></path>
                <path d="M43.611,20.083H42V20H24v8h11.303c-.792,2.237-2.231,4.166-4.089,5.571l6.19,5.238C41.38,36.128,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"></path>
              </svg>
              <span className="text-sm font-medium text-white">Continue with Google</span>
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-white/10 dark:bg-white/10 hover:bg-white/20 transition-colors duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.01,2.029c-2.316,0-4.325,1.25-5.51,3.136c-1.391,2.15-1.543,5.334.22,7.742c.983,1.34,2.378,2.146,3.921,2.146c.418,0,.726-.062,1.173-.186c1.196,2.944,3.13,4.143,5.496,4.143c.31,0,.767-.042,1.144-.125c.063-.017.126-.03.19-.045c.29-.07.606-.186.848-.31c.148-.077.295-.164.433-.252c-2.521-1.34-4.22-3.82-4.22-6.529c0-2.812,2.046-4.484,4.282-4.484c.334,0,.668.02,1.002.062C20.612,5.29,16.925,2.03,12.01,2.029Zm.295,7.502c-.983-1.36-1.526-2.9-1.36-4.43c.966-1.32,2.57-2.12,4.162-2.12c-.105,2.247-1.474,4.354-2.802,6.55Z"></path>
              </svg>
              <span className="text-sm font-medium text-white">Continue with Apple</span>
            </button>
          </div>
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="mx-4 text-sm text-muted-dark">Or</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="sr-only" htmlFor="email">Email or username</label>
              <input 
                className="form-input w-full rounded-lg bg-white/10 dark:bg-white/10 border-none focus:ring-2 focus:ring-primary placeholder-muted-dark text-white p-4" 
                id="email" 
                name="email" 
                placeholder="Email or username" 
                type="text"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="password">Password</label>
              <input 
                className="form-input w-full rounded-lg bg-white/10 dark:bg-white/10 border-none focus:ring-2 focus:ring-primary placeholder-muted-dark text-white p-4" 
                id="password" 
                name="password" 
                placeholder="Password" 
                type="password"
              />
            </div>
            <button 
              className="w-full py-3 px-4 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-base transition-colors duration-300 shadow-lg shadow-primary/20" 
              type="submit"
            >
              Login
            </button>
          </form>
          <div className="mt-6 flex justify-between items-center text-sm">
            <a className="font-medium text-muted-dark hover:text-white transition-colors duration-300" href="#">
              Forgot password?
            </a>
            <a className="font-medium text-muted-dark hover:text-white transition-colors duration-300" href="#">
              Need an account? <span className="font-bold text-white">Sign up</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;