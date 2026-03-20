import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [resetLink, setResetLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setResetLink('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw data

      setSent(true)
      if (data.resetToken) {
        setResetLink(`${window.location.origin}/reset-password?token=${data.resetToken}`)
      }
    } catch (err) {
      setError(err.error || 'Something went wrong')
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
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center w-10 h-10 hover:bg-primary hover:text-white transition-colors duration-200">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-12 md:py-24">
        <div className="max-w-md w-full">
          {/* Main Card */}
          <div className="bg-white architectural-border p-8 md:p-12 tactile-shadow relative overflow-hidden">
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary opacity-10 transform translate-x-8 -translate-y-8 rotate-45"></div>

            {/* Header */}
            <div className="mb-10 text-center md:text-left">
              <h1 className="font-heading font-bold text-4xl md:text-5xl tracking-tighter text-[#131313] mb-4">
                Forgot Password?
              </h1>
              <p className="text-[#131313]/70 leading-relaxed text-lg">
                Enter your email and we&apos;ll generate a link to reset your password.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 font-body text-sm mb-6">
                {error}
              </div>
            )}

            {/* Success with reset link */}
            {sent && resetLink && (
              <div className="bg-green-50 border-2 border-green-300 px-4 py-4 mb-6 space-y-3">
                <p className="text-green-800 font-body text-sm font-bold">Reset link generated!</p>
                <a
                  href={resetLink}
                  className="text-primary font-body text-sm font-bold underline underline-offset-4 break-all block"
                >
                  {resetLink}
                </a>
              </div>
            )}

            {/* Success but email not found (we don't reveal that) */}
            {sent && !resetLink && (
              <div className="bg-green-50 border-2 border-green-300 text-green-800 px-4 py-3 font-body text-sm mb-6">
                If that email is registered, a reset link has been generated.
              </div>
            )}

            {/* Form */}
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="font-label font-bold text-xs uppercase tracking-widest text-[#131313]/60 block px-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    className="w-full bg-[#F5F2F0] border-2 border-border px-4 py-4 font-body focus:ring-0 focus:border-primary outline-none transition-all duration-200 block placeholder:text-[#131313]/30"
                    id="email"
                    name="email"
                    placeholder="name@studio.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute inset-0 border-2 border-primary pointer-events-none opacity-0 group-focus-within:opacity-100 translate-x-1 translate-y-1 -z-10 transition-transform"></div>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-6 pt-2">
                <button
                  className="w-full bg-primary text-white font-heading font-bold text-lg py-5 px-6 tactile-shadow hover:brightness-110 transition-all active:scale-[0.98] active:shadow-none flex items-center justify-center gap-3 disabled:opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
                  {!loading && <span className="material-symbols-outlined text-xl">send</span>}
                </button>
                <div className="flex justify-center pt-4">
                  <Link to="/signin" className="inline-flex items-center gap-2 text-primary font-bold hover:underline transition-all group">
                    <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">arrow_back</span>
                    <span className="font-label text-sm uppercase tracking-widest">Back to Login</span>
                  </Link>
                </div>
              </div>
            </form>
          </div>

          {/* Info */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 px-2 opacity-60">
            <div className="flex items-center gap-4">
              <div className="w-8 h-[2px] bg-black"></div>
              <span className="text-xs font-bold uppercase tracking-widest font-label">Account Security</span>
            </div>
            <div className="text-xs font-medium max-w-[200px] text-center md:text-right leading-tight">
              Your workspace is encrypted with architectural grade protocols.
            </div>
          </div>
        </div>
      </main>

      {/* Background Texture */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden opacity-5">
        <div className="absolute top-1/4 -left-20 w-96 h-96 border-[40px] border-black rounded-full"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 border-2 border-black rotate-12"></div>
        <div className="absolute top-10 right-1/4 w-px h-full bg-black"></div>
        <div className="absolute left-1/3 top-0 w-px h-full bg-black"></div>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#131313]/40">
        <div>&copy; 2024 TASHY Studio</div>
        <div className="flex gap-8">
          <a className="hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="hover:text-primary transition-colors" href="#">Support</a>
          <a className="hover:text-primary transition-colors" href="#">Terms</a>
        </div>
      </footer>
    </div>
  )
}
