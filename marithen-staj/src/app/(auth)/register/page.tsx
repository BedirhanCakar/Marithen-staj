'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/shared/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/shared/components/ThemeToggle'
import { Mail, Lock, Eye, EyeOff, User, Phone, CheckCircle2, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '')
    // Remove leading zero if user typed it
    if (value.startsWith('0')) {
      value = value.substring(1)
    }
    // Limit to 10 digits
    if (value.length <= 10) {
      setPhone(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setPhoneError(null)
    setPasswordError(null)
    setConfirmPasswordError(null)

    let isValid = true

    // Validations
    if (phone.length !== 10) {
      setPhoneError('Telefon numarası 10 haneli olmalıdır (başında 0 olmadan).')
      isValid = false
    }

    if (password.length < 8) {
      setPasswordError('Şifre en az 8 karakter olmalıdır.')
      isValid = false
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Şifreler eşleşmiyor.')
      isValid = false
    }

    if (!isValid) return

    setLoading(true)

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: '+90' + phone,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kayıt olurken bir hata oluştu.'
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

      {/* Left Column (Brand & Gradients) - Same as Login Page */}
      <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
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

      {/* Right Column (Form / Success Card) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 relative">
        <div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent pointer-events-none" />

        <div className="w-full max-w-md space-y-8 z-10">
          
          {success ? (
            /* Success State Card */
            <div className="text-center p-8 rounded-2xl bg-card-bg border border-card-border backdrop-blur-md shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-center">
                <CheckCircle2 className="w-16 h-16 text-success animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-success">
                  Neredeyse tamam! 🎉
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  E-posta adresinize bir doğrulama linki gönderdik. Hesabınızı etkinleştirmek için lütfen gelen kutunuzu (ve gereksiz kutusunu) kontrol edin.
                </p>
              </div>
              <div className="pt-4">
                <Link href="/login">
                  <Button className="w-full py-6 bg-gradient-to-r from-violet-500 to-pink-500 dark:from-indigo-500 dark:to-purple-600 hover:from-violet-600 hover:to-pink-600 dark:hover:from-indigo-600 dark:hover:to-purple-700 text-white font-bold rounded-xl cursor-pointer">
                    Giriş Sayfasına Git
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            /* Register Form State */
            <>
              <div className="text-center lg:text-left space-y-2">
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Hesap Oluştur
                </h2>
                <p className="text-sm text-muted">
                  Hemen kaydolun ve başlayın
                </p>
              </div>

              {error && (
                <div className="rounded-xl bg-error/10 p-4 text-sm text-error border border-error/20 animate-in fade-in zoom-in-95 duration-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-sm font-semibold">
                    Ad Soyad
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                      <User className="w-5 h-5" />
                    </span>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Ahmet Yılmaz"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-6 bg-input-bg border-input-border text-foreground placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
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
                      className="w-full pl-10 pr-4 py-6 bg-input-bg border-input-border text-foreground placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm font-semibold">
                    Telefon Numarası
                  </Label>
                  <div className="flex rounded-xl shadow-sm border border-input-border bg-input-bg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200">
                    <span className="flex items-center px-3 bg-slate-200 dark:bg-slate-800 text-muted-foreground border-r border-input-border font-medium text-sm">
                      <Phone className="w-4 h-4 mr-1.5 text-muted" />
                      +90
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="5XX XXX XX XX"
                      value={phone}
                      onChange={handlePhoneChange}
                      maxLength={10}
                      required
                      className="w-full py-6 px-4 bg-transparent border-0 focus:ring-0 focus:border-0 rounded-none shadow-none text-foreground placeholder:text-muted/60"
                    />
                  </div>
                  {phoneError && (
                    <p className="text-xs text-error font-medium pl-1 animate-in fade-in duration-200">
                      {phoneError}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm font-semibold">
                    Şifre
                  </Label>
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
                      className="w-full pl-10 pr-12 py-6 bg-input-bg border-input-border text-foreground placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-foreground cursor-pointer focus:outline-none transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-xs text-error font-medium pl-1 animate-in fade-in duration-200">
                      {passwordError}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                    Şifre Tekrar
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                      <Lock className="w-5 h-5" />
                    </span>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-12 py-6 bg-input-bg border-input-border text-foreground placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-foreground cursor-pointer focus:outline-none transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirmPasswordError && (
                    <p className="text-xs text-error font-medium pl-1 animate-in fade-in duration-200">
                      {confirmPasswordError}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-gradient-to-r from-violet-500 to-pink-500 dark:from-indigo-500 dark:to-purple-600 hover:from-violet-600 hover:to-pink-600 dark:hover:from-indigo-600 dark:hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/25 cursor-pointer transform hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    'Kaydol'
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-muted pt-4 border-t border-card-border/50">
                Zaten hesabın var mı?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors duration-200"
                >
                  Giriş yap
                </Link>
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  )
}
