import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    throw new Error("Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
  }

  return { url, key }
}

function isAuthRoute(pathname: string) {
  if (pathname === "/auth/logout") {
    return false
  }

  return pathname === "/auth" || pathname.startsWith("/auth/")
}

function isProtectedRoute(pathname: string) {
  const isProtectedHome = pathname === "/"
  const isNewFormBuilder = pathname === "/form/new" || pathname.startsWith("/form/new/")
  const isFormPreview = /^\/form\/[^/]+\/preview$/.test(pathname)
  const isFormResponses = /^\/form\/[^/]+\/responses$/.test(pathname)

  return isProtectedHome || isNewFormBuilder || isFormPreview || isFormResponses
}

export async function updateSession(request: NextRequest) {
  const { url, key } = getSupabaseEnv()

  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  if (!user && isProtectedRoute(pathname)) {
    const redirectUrl = new URL("/auth", request.url)
    redirectUrl.searchParams.set("reason", "unauthorized")
    redirectUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (user && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return response
}
