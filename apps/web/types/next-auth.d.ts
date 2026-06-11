import 'next-auth'

declare module 'next-auth' {
  interface User {
    role?: string
    subscription?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      subscription: string
      image?: string
    }
  }
}
