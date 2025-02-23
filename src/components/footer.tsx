import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 mt-8 py-4">
      <div className="max-w-3xl mx-auto text-center text-sm text-slate-400">
        <div className="mb-2 flex justify-center gap-4">
          <Link
            href="https://github.com/xhos"
            className="hover:text-slate-200 transition-colors"
          >
            <Image src="/github.svg" alt="GitHub" width={20} height={20} />
          </Link>
          <Link
            href="https://www.linkedin.com/in/markkudriavtsev/"
            className="hover:text-slate-200 transition-colors"
          >
            <Image src="/linkedin.svg" alt="LinkedIn" width={20} height={20} />
          </Link>
          <Link
            href="mailto:markkudriavtsev@pm.me"
            className="hover:text-slate-200 transition-colors"
          >
            <Image src="/mail.svg" alt="Email" width={20} height={20} />
          </Link>
        </div>
        <div>
          built with next and tailwind by yours truly. deployed on vercel.
        </div>
        <div className="mt-2">
          © 2025, mark kudriavtsev. mit license.
        </div>
      </div>
    </footer>
  );
}