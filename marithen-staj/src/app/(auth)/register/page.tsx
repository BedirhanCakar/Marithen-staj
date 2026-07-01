'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/shared/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function RegisterPage() {
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Password match check
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.')
      return
    }

    setLoading(true)

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
      } else {
        setSuccess('Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.')
        // Clear fields
        setFullName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kayıt olurken bir hata oluştu.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4">
      <Card className="w-full max-w-md border-slate-700/50 bg-slate-900/60 text-slate-100 backdrop-blur-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Hesap Oluştur
          </CardTitle>
          <CardDescription className="text-slate-400">
            Hemen kaydolun ve başlayın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-950/40 p-3 text-sm text-red-400 border border-red-900/30 animate-in fade-in zoom-in-95 duration-200">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg bg-emerald-950/40 p-3 text-sm text-emerald-400 border border-emerald-900/30 animate-in fade-in zoom-in-95 duration-200">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-slate-300">
                Ad Soyad
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Ahmet Yılmaz"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-slate-950/40 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                E-posta
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@marithen.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-950/40 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Şifre
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-950/40 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-300">
                Şifre Tekrar
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-slate-950/40 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold transition-all shadow-md shadow-emerald-500/10 cursor-pointer py-5"
              disabled={loading}
            >
              {loading ? 'Kaydediliyor...' : 'Kaydol'}
            </Button>
          </form>
          <div className="text-center text-sm text-slate-400 pt-2 border-t border-slate-800">
            Zaten hesabın var mı?{' '}
            <Link
              href="/login"
              className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline transition-all"
            >
              Giriş yap
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
