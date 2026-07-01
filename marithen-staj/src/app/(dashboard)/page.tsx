'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-100 p-6">
      <div className="text-center space-y-6 max-w-md w-full bg-slate-900/40 p-8 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-slate-400">
          Dashboard - Yakında hizmetinizde olacak.
        </p>
        <div className="pt-4">
          <Button
            onClick={handleSignOut}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50 cursor-pointer py-5"
          >
            Çıkış Yap
          </Button>
        </div>
      </div>
    </div>
  )
}
