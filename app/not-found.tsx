import Link from "next/link";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center p-6"><section className="card max-w-md p-8 text-center"><p className="text-6xl font-extrabold text-blue-200">404</p><h1 className="mt-3 text-2xl font-extrabold">No encontrado</h1><p className="muted mt-2">El presupuesto no existe, está desactivado o su enlace ha caducado.</p><Link href="/" className="btn btn-primary mt-6">Ir al inicio</Link></section></main>;
}
