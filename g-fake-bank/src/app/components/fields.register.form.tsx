'use client'
export function FieldsRegisterForm() {

    return (
        <div>
            <div className="mb-4">
                <label className="font-bold">Nome</label>
                <input
                    required
                    name="name"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Digite seu nome"
                />
            </div>

            <div className="mb-4">
                <label className="font-bold">Senha</label>
                <input
                    required
                    name="password"
                    type="password"
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Digite sua senha"
                />
            </div>
            <div className="mb-4">
                <label className="font-bold">Confirmar Senha</label>
                <input
                    required
                    name="confirmPassword"
                    type="password"
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Confirme sua senha"
                />
            </div>
        </div>
    )
}