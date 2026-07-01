'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4">
      <Card className="w-full max-w-md border-slate-700/50 bg-slate-900/60 text-slate-100 backdrop-blur-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Marithen
          </CardTitle>
          <CardDescription className="text-slate-400">
            Hesabınıza giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-950/40 p-3 text-sm text-red-400 border border-red-900/30 animate-in fade-in zoom-in-95 duration-200">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold transition-all shadow-md shadow-emerald-500/10 cursor-pointer py-5"
              disabled={loading}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>
          <div className="text-center text-sm text-slate-400 pt-2 border-t border-slate-800">
            Hesabın yok mu?{' '}
            <Link
              href="/register"
              className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline transition-all"
            >
              Kayıt ol
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
