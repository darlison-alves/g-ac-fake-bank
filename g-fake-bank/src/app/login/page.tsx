'use client'

import Form from 'next/form'
import { login } from './actions'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {

  const searchParams = useSearchParams()
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Form
        action={login}
        className="dark:bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl mb-6 font-semibold text-center">Acesso a conta</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="conta"
          name='accountNumber'
          className="w-full p-3 mb-4 border border-gray-300 rounded"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          name='password'
          className="w-full p-3 mb-4 border border-gray-300 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700 transition"
        >
          Entrar
        </button>
        <div className="mt-4 text-center">
          <p className="text-gray-500">
            Não tem uma conta?{' '}
            <a href="/register" className="text-purple-600 hover:underline">
              Cadastre-se
            </a>
          </p>
        </div>
      </Form>

    </div>
  )
}
