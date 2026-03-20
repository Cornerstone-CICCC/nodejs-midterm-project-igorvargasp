import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.feedback?.suggestions?.length) {
          throw { error: `${data.error}. ${data.feedback.suggestions.join(' ')}` }
        }
        throw data
      }
      setSuccess(true)
      setTimeout(() => navigate('/signin'), 3000)
    } catch (err) {
      setError(err.error || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="bg-background font-body text-on-surface min-h-screen flex flex-col items-center justify-center p-6">
        <div className="bg-white architectural-border p-8 tactile-shadow max-w-md w-full text-center space-y-4">
          <h1 className="font-heading font-bold text-3xl text-[#131313]">Invalid Link</h1>
          <p className="text-[#131313]/70">This reset link is missing or invalid.</p>
          <Link to="/forgot-password" className="text-primary font-bold underline">Request a new one</Link>
        </div>
      </div>
    )
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
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-12 md:py-24">
        <div className="max-w-md w-full">
          <div className="bg-white architectural-border p-8 md:p-12 tactile-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary opacity-10 transform translate-x-8 -translate-y-8 rotate-45"></div>

            <div className="mb-10 text-center md:text-left">
              <h1 className="font-heading font-bold text-4xl md:text-5xl tracking-tighter text-[#131313] mb-4">
                Reset Password
              </h1>
              <p className="text-[#131313]/70 leading-relaxed text-lg">
                Enter your new password below.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 font-body text-sm mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-2 border-green-300 text-green-800 px-4 py-3 font-body text-sm mb-6">
                Password reset successfully! Redirecting to sign in...
              </div>
            )}

            {!success && (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="font-label font-bold text-xs uppercase tracking-widest text-[#131313]/60 block px-1">
                    New Password
                  </label>
                  <input
                    className="w-full bg-[#F5F2F0] border-2 border-border px-4 py-4 font-body focus:ring-0 focus:border-primary outline-none transition-all placeholder:text-[#131313]/30"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-label font-bold text-xs uppercase tracking-widest text-[#131313]/60 block px-1">
                    Confirm New Password
                  </label>
                  <input
                    className="w-full bg-[#F5F2F0] border-2 border-border px-4 py-4 font-body focus:ring-0 focus:border-primary outline-none transition-all placeholder:text-[#131313]/30"
                    placeholder="••••••••"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  className="w-full bg-primary text-white font-heading font-bold text-lg py-5 px-6 tactile-shadow hover:brightness-110 transition-all active:scale-[0.98] active:shadow-none flex items-center justify-center gap-3 disabled:opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#131313]/40">
        <div>&copy; 2024 TASHY Studio</div>
      </footer>
    </div>
  )
}
