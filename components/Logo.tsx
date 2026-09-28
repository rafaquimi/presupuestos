import Link from "next/link";
import { FileText } from "lucide-react";

export default function Logo({ publicView = false }: { publicView?: boolean }) {
  const content = (
    <span className="flex items-center gap-3 font-extrabold text-slate-900">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white"><FileText size={21} /></span>
      <span>Presupuestos</span>
    </span>
  );
  return publicView ? content : <Link href="/" className="no-underline">{content}</Link>;
}
