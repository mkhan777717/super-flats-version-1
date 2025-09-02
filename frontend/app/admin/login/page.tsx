import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SuperFlats Admin</h1>
            <p className="text-gray-600">Sign in to manage properties</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
