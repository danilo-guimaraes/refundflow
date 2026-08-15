import { useActionState } from "react";
import { Link } from "react-router";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { z, ZodError } from "zod";
import { api } from "../services/api";
import { AxiosError } from "axios";
import UseAuth from "../hooks/useAuth";
const signInScheme = z.object({
  email: z.string().email({ message: "E-mail Invalido" }),
  password: z.string().trim().min(1, { message: "Senha Invalida" }),
});

export function SignIn() {
  const [state, formAction, isLoading] = useActionState(onAction, null);

  const auth = UseAuth();

  async function onAction(_prevState: any, formData: FormData) {
    try {
      const data = signInScheme.parse({
        email: formData.get("email"),
        password: formData.get("password"),
      });

      const response = await api.post("/sessions", data);
      auth.save(response.data);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        return { message: error.issues[0].message };
      }
      if (error instanceof AxiosError) {
        return { message: error.response?.data.message };
      }
      return { message: "Nao foi possivel entrar" };
    }
  }

  return (
    <form action={formAction} className="w-full flex flex-col gap-4">
      <Input
        name="email"
        required
        legend="E-mail"
        type="email"
        placeholder="seu@email.com"
      />
      <Input
        name="password"
        required
        legend="Senha"
        type="password"
        placeholder="123456"
      />

      <p className="text-sm text-red-600 text-center my-4 font-semibold">
        {state?.message}
      </p>

      <Button type="submit" isLoading={isLoading}>
        Entrar
      </Button>

      <Link
        to="/signup"
        className="text-sm font-semibold text-gray-100 mt-10 mb-4 text-center hover:text-green-800 transition ease-linear"
      >
        Criar conta
      </Link>
    </form>
  );
}
