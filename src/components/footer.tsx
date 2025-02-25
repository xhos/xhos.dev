import Link from "next/link";
import Image from "next/image";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export default function Footer() {
  // future-proof lol
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`mt-8 py-4 ${jetbrainsMono.className}`}>
      <div className="max-w-3xl mx-auto text-center text-sm text-muted-400">
        {/* Display icons only on small screens */}
        <div className="mb-2 flex justify-center gap-4 block md:hidden">
          <Link
            href="https://github.com/xhos"
            className="hover:text-muted-200 transition-colors"
          >
            <Image src="/github.svg" alt="GitHub" width={20} height={20} />
          </Link>
          <Link
            href="https://www.linkedin.com/in/markkudriavtsev/"
            className="hover:text-muted-200 transition-colors"
          >
            <Image src="/linkedin.svg" alt="LinkedIn" width={20} height={20} />
          </Link>
          <Link
            href="mailto:markkudriavtsev@pm.me"
            className="hover:text-muted-200 transition-colors"
          >
            <Image src="/mail.svg" alt="Email" width={20} height={20} />
          </Link>
        </div>
        <div>
          built with next and tailwind by yours truly. deployed on vercel
        </div>
        <div className="mt-2">
          © {currentYear}, mark kudriavtsev, mit license
        </div>
      </div>
    </footer>
  );
}