import Link from "next/link";
import { Settings, Users } from "lucide-react";
import Logo from "./Logo";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container-app flex min-h-16 items-center justify-between gap-4 py-2 mobile-stack">
        <Logo />
        <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Principal">
          <Link href="/clientes" className="btn btn-ghost"><Users size={17} /> Clientes</Link>
          <Link href="/configuracion" className="btn btn-ghost"><Settings size={17} /> Configuración</Link>
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}
