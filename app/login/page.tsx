import { ShieldCheck } from "lucide-react";
import LoginForm from "@/components/LoginForm";
import Logo from "@/components/Logo";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const nextPath = (await searchParams).next || "/";
  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <section className="card w-full max-w-md p-7 sm:p-9">
        <div className="mb-8"><Logo publicView /><h1 className="mt-8 text-2xl font-extrabold">Acceso al panel</h1><p className="muted mt-2">Introduce tus credenciales de administrador.</p></div>
        <LoginForm nextPath={nextPath} />
        <p className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-500"><ShieldCheck size={15} /> Sesión cifrada y protegida</p>
      </section>
    </main>
  );
}
