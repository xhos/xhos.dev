import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Glitch from "@/components/glitch";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <Card className="relative items-left w-full max-w-md">
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <Link
            href="https://github.com/xhos"
            className="p-1 rounded hover:bg-secondary transition-colors duration-200"
          >
            <Image
              aria-hidden
              src="/github.svg"
              alt="Github"
              width={16}
              height={16}
            />
          </Link>
          <Link
            href="https://www.linkedin.com/in/markkudriavtsev/"
            className="p-1 rounded hover:bg-secondary transition-colors duration-200"
          >
            <Image
              aria-hidden
              src="/linkedin.svg"
              alt="LinkedIn"
              width={16}
              height={16}
            />
          </Link>
          <Link
            href="mailto:markkudriavtsev@pm.me"
            className="p-1 rounded hover:bg-secondary transition-colors duration-200"
          >
            <Image
              aria-hidden
              src="/mail.svg"
              alt="Mail"
              width={16}
              height={16}
            />
          </Link>
        </div>
        <CardHeader>
          <CardTitle>mark kudriavtsev//</CardTitle>
          <CardDescription>
            full stack dev | 2nd year comp-sci student
            <br />
            <div className="inline-flex items-center gap-1">
              <Image
                aria-hidden
                src="/map-pin.svg"
                alt="Map pin"
                width={16}
                height={16}
              />
              <span>Toronto, Canada</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          my <Glitch>????</Glitch> years of experience span across a vast set of languages and frameworks,
          from C++ and Rust to TS/React/Next. i&apos;m always on the lookout for new opportunities, so feel free to reach out!
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>
    </div >
  );
}