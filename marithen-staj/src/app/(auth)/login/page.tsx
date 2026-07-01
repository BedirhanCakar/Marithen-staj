'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/shared/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/shared/components/ThemeToggle'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Giriş yapılırken bir hata oluştu.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* Theme Toggle (Top Right) */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left Column (Brand & Gradients) */}
      <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
        {/* Gradient Backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-500 via-purple-500 to-pink-500 dark:from-slate-900 dark:via-indigo-950 dark:to-blue-950 transition-all duration-500" />
        
        {/* Decorative Floating Shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-pink-400/20 dark:bg-purple-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-yellow-300/15 dark:bg-blue-400/10 blur-3xl animate-bounce duration-10000" />

        {/* Floating Cards (Glassmorphic Mockups) */}
        <div className="absolute top-[20%] right-[15%] w-72 p-4 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-300">📈</div>
            <div>
              <p className="text-xs font-semibold text-white">Etkileşim Artışı</p>
              <p className="text-[10px] text-white/70">Instagram profilinizde +45% artış</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[25%] left-[15%] w-64 p-4 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300">📅</div>
            <div>
              <p className="text-xs font-semibold text-white">Planlanan İçerik</p>
              <p className="text-[10px] text-white/70">Bugün 18:00 - LinkedIn Gönderisi</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-xl text-center px-8 text-white space-y-4">
          <h1 className="text-6xl font-black tracking-tight select-none">
            Marithen
          </h1>
          <p className="text-xl font-medium text-white/90">
            Sosyal medyanı tek panelden yönet
          </p>
        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 relative">
        {/* Subtle background blob for light/dark modes */}
        <div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent pointer-events-none" />

        <div className="w-full max-w-md space-y-8 z-10">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Tekrar hoş geldin 👋
            </h2>
            <p className="text-sm text-muted">
              Hesabına giriş yap
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-error/10 p-4 text-sm text-error border border-error/20 animate-in fade-in zoom-in-95 duration-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                E-posta Adresi
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                  <Mail className="w-5 h-5" />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@marithen.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-6 bg-input-bg border-input-border text-foreground placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold">
                  Şifre
                </Label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                  <Lock className="w-5 h-5" />
                </span>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-6 bg-input-bg border-input-border text-foreground placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-foreground cursor-pointer focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-gradient-to-r from-violet-500 to-pink-500 dark:from-indigo-500 dark:to-purple-600 hover:from-violet-600 hover:to-pink-600 dark:hover:from-indigo-600 dark:hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/25 cursor-pointer transform hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Giriş Yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted pt-4 border-t border-card-border/50">
            Hesabın yok mu?{' '}
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors duration-200"
            >
              Kayıt ol
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
