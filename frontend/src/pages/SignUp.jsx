import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignUp() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await signup({ username, email, password })
      navigate('/workspace')
    } catch (err) {
      // Show password feedback if available
      if (err.feedback?.suggestions?.length) {
        setError(`${err.error}. ${err.feedback.suggestions.join(' ')}`)
      } else {
        setError(err.error || 'Signup failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background font-body text-on-surface min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="bg-[#F5F2F0] flex justify-between items-center w-full px-6 py-4 border-b-2 border-black sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/signin" className="flex items-center justify-center w-10 h-10 hover:bg-primary hover:text-white transition-colors duration-200">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <Link to="/" className="text-2xl font-black text-primary uppercase tracking-tighter font-heading flex items-center">
            <img src="/logo.png" alt="" className="h-6 w-auto" />TASHY
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center w-10 h-10 hover:bg-primary hover:text-white transition-colors duration-200">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6 sm:p-12 lg:p-24">
        {/* Registration Card */}
        <div className="w-full max-w-xl bg-white border-2 border-border shadow-[4px_4px_0px_#EDDFD0] p-8 md:p-12 relative overflow-hidden">
          {/* Branding Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-5 -mr-16 -mt-16 rounded-full"></div>

          {/* Header */}
          <div className="mb-10">
            <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tighter text-[#131313] mb-2">Create Account</h2>
            <p className="text-[#A0A0A0] font-medium tracking-tight text-lg">Join the creative workspace</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 font-body text-sm mb-6">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="font-heading font-bold text-xs uppercase tracking-widest text-[#131313]">Username</label>
                <input
                  className="w-full bg-[#F5F2F0] border-2 border-border focus:border-primary focus:ring-0 p-4 font-body outline-none transition-all placeholder:text-[#A0A0A0]"
                  placeholder="alexmorgan"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-heading font-bold text-xs uppercase tracking-widest text-[#131313]">Email Address</label>
                <input
                  className="w-full bg-[#F5F2F0] border-2 border-border focus:border-primary focus:ring-0 p-4 font-body outline-none transition-all placeholder:text-[#A0A0A0]"
                  placeholder="alex@studio.design"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-heading font-bold text-xs uppercase tracking-widest text-[#131313]">Password</label>
                <input
                  className="w-full bg-[#F5F2F0] border-2 border-border focus:border-primary focus:ring-0 p-4 font-body outline-none transition-all"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-heading font-bold text-xs uppercase tracking-widest text-[#131313]">Confirm Password</label>
                <input
                  className="w-full bg-[#F5F2F0] border-2 border-border focus:border-primary focus:ring-0 p-4 font-body outline-none transition-all"
                  placeholder="••••••••"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Primary Action */}
            <div className="pt-4">
              <button
                className="w-full bg-primary text-white font-heading font-bold text-xl py-5 transition-all hover:shadow-[4px_4px_0px_#000000] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Register'}
                {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-10 pt-8 border-t-2 border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-[#A0A0A0] text-sm font-medium">Already have an account?</span>
            <Link to="/signin" className="font-heading font-bold text-primary flex items-center gap-2 hover:translate-x-1 transition-transform group">
              Sign in <span className="material-symbols-outlined text-sm">login</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Background Decorative */}
      <div className="fixed bottom-0 left-0 p-8 opacity-10 pointer-events-none hidden lg:block">
        <div className="w-48 h-48 border-2 border-[#131313] relative">
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary"></div>
          <div className="absolute inset-4 border border-dashed border-[#131313]"></div>
        </div>
      </div>

      <footer className="p-6 text-center text-[#A0A0A0] text-xs font-bold uppercase tracking-[0.2em]">
        &copy; 2024 TASHY &bull; Studio Workspace System
      </footer>
    </div>
  )
}
