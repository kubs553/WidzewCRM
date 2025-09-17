import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (req.nextUrl.pathname.startsWith('/api/auth') || 
            req.nextUrl.pathname === '/' ||
            req.nextUrl.pathname.startsWith('/widget') ||
            req.nextUrl.pathname.startsWith('/embed')) {
          return true
        }

        // Require authentication for admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*'
  ]
}
