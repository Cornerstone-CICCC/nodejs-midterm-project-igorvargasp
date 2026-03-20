import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignIn() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/workspace')
    } catch (err) {
      setError(err.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center bg-[#F5F2F0] border-b-2 border-black tactile-shadow">
        <Link to="/" className="text-2xl font-black text-primary uppercase tracking-tighter font-heading">
          <span className="flex items-center"><img src="/logo.png" alt="" className="h-6 w-auto" />TASHY</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[#131313] cursor-pointer hover:bg-primary hover:text-white transition-colors p-2 rounded-lg">help</span>
        </div>
      </header>

      <main className="w-full max-w-md mt-20">
        {/* Login Card */}
        <div className="bg-white architectural-border tactile-shadow p-8 md:p-10 flex flex-col gap-8">
          {/* Header Group */}
          <div className="space-y-2">
            <h1 className="font-heading font-bold text-4xl text-[#131313] tracking-tight uppercase flex items-center">
              <img src="/logo.png" alt="" className="h-8 w-auto" />TASHY
            </h1>
            <p className="font-body text-[#131313] text-lg opacity-80 leading-relaxed">
              The digital creative studio
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 font-body text-sm">
              {error}
            </div>
          )}

          {/* Form Content */}
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="font-label font-bold text-xs uppercase tracking-wider text-[#131313]">Email Address</label>
              <input
                className="w-full bg-[#F5F2F0] architectural-border px-4 py-3 font-body text-[#131313] focus:outline-none focus:border-primary transition-all placeholder:opacity-50"
                placeholder="hello@studio.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="font-label font-bold text-xs uppercase tracking-wider text-[#131313]">Password</label>
                <Link to="/forgot-password" className="font-label text-xs font-bold text-primary hover:underline">Forgot Password?</Link>
              </div>
              <input
                className="w-full bg-[#F5F2F0] architectural-border px-4 py-3 font-body text-[#131313] focus:outline-none focus:border-primary transition-all placeholder:opacity-50"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Action Button */}
            <button
              className="w-full bg-primary text-white font-heading font-bold text-lg py-4 border-2 border-black tactile-shadow active:scale-[0.98] active:shadow-[2px_2px_0px_#000000] hover:brightness-110 transition-all uppercase tracking-tight mt-4 disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Secondary Actions */}
          <div className="pt-4 border-t-2 border-border flex flex-col items-center gap-4">
            <p className="font-body text-sm text-[#131313] opacity-60">Don&apos;t have an account yet?</p>
            <Link
              to="/signup"
              className="font-heading font-bold text-[#131313] hover:text-primary transition-colors border-b-2 border-[#131313] hover:border-primary pb-0.5"
            >
              Create an Account
            </Link>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="mt-12 flex justify-center gap-8 opacity-20">
          <div className="w-12 h-12 architectural-border rotate-45"></div>
          <div className="w-12 h-12 architectural-border"></div>
          <div className="w-12 h-12 architectural-border rounded-full"></div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[#131313] opacity-40">
          &copy; 2024 TASHY &bull; Established for Creators
        </p>
      </footer>
    </div>
  )
}
