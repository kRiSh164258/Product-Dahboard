import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser, clearError } from '../feature/auth/authSlice'

const empty = { firstName: '', lastName: '', username: '', email: '', password: '' }

export default function RegisterPage() {
  const [form, setForm]       = useState(empty)
  const [success, setSuccess] = useState(false)
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { loading, error } = useSelector((s) => s.auth)

  useEffect(() => () => dispatch(clearError()), [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await dispatch(registerUser(form))
    if (res.meta.requestStatus === 'fulfilled') {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1500)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md animate-slide-up shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-1">Create account</h1>
        <p className="text-gray-400 mb-8 text-sm">Fill in your details to get started</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl mb-4 text-sm animate-fade-in">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/40 text-green-300 px-4 py-3 rounded-xl mb-4 text-sm animate-fade-in">
            Account created successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-300 text-sm block mb-1">First name</label>
              <input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm block mb-1">Last name</label>
              <input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {[
            { key: 'username', label: 'Username',  type: 'text' },
            { key: 'email',    label: 'Email',     type: 'email' },
            { key: 'password', label: 'Password',  type: 'password' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="text-gray-300 text-sm block mb-1">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] mt-2">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
// ```

// ---

// ## How the full flow works now
// ```
// Register → saved to localStorage (users array)
//             ↓
// Login → finds user in localStorage → validates password
//             ↓
// Generate JWT token → saved to localStorage (token key)
//             ↓
// Redux stores token + user
//             ↓
// ProtectedRoute → decodes token → checks expiry → allows/blocks
//             ↓
// Logout → clears token from localStorage + Redux