"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { createClient } from "@/lib/supabase/client"

export function ResponsesBroadcastListener({
  ownerId,
}: {
  ownerId: string
}) {
  const router = useRouter()

  useEffect(() => {
    if (!ownerId) return

    const supabase = createClient()
    const channel = supabase
      .channel(`form-responses:${ownerId}`, {
        config: { private: true },
      })
      .on("broadcast", { event: "INSERT" }, () => {
        router.refresh()
      })
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [ownerId, router])

  return null
}
