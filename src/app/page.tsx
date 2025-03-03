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
import { Badge } from "@/components/ui/badge";
import { JetBrains_Mono } from "next/font/google";
import Footer from "@/components/footer"


const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row items-start min-h-screen">
      {/* Left Side - On mobile it's at the top */}
      <div className="w-full md:w-1/2 sticky md:top-0 h-auto md:h-screen flex items-center justify-center p-8 bg-background">
        <Card className="relative w-full max-w-md card-with-glow-effect">
          <div className="absolute top-5 right-5 flex items-center gap-2">
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
            <CardTitle className={`${jetbrainsMono.className}`}>mark kudriavtsev//</CardTitle>
            <CardDescription>
              full stack dev | 2nd year comp-sci student
              <br />
              <div className="inline-flex items-center gap-1">
                <Image
                  aria-hidden
                  src="/map-pin.svg"
                  alt="Map pin"
                  width={12}
                  height={12}
                />
                <span>toronto, canada</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            my <Glitch>δνψν</Glitch> years of experience span dynamic web development with <b>react/next</b>, robust app development in <b>python/go</b>, and end-to-end infrastructure architecture, deployment, and monitoring.
            <br /><br />
            interested in my resume? just want to say hi? feel free to reach me at <Link href="mailto:markkudriavtsev@pm.me" className="underline">markkudriavtsev@pm.me</Link>
          </CardContent>
          <CardFooter />
        </Card>
      </div>

      {/* Right Side - Scrollable Content */}
      <div className="w-full md:w-1/2 overflow-y-auto p-8">
        {/* Experience Section */}
        <section className="mb-16">
          <h2 className={`text-3xl font-bold mb-4 ${jetbrainsMono.className}`}>experience</h2>
          <h3 className="text-xl font-bold mb-2">full stack developer</h3>
          <p className="mb-2">
            arial real estate
            <span className="text-muted-foreground"> sep 2021 – aug 2023 </span>
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="outline">python</Badge>
            <Badge variant="outline">typescript</Badge>
            <Badge variant="outline">node</Badge>
            <Badge variant="outline">next</Badge>
            <Badge variant="outline">docker</Badge>
          </div>
          <p className="mb-6">
            • <strong>Centralized Integration:</strong> Built a TypeScript/Node.js system that synchronizes multiple external APIs in real time. <br />
            • <strong>Dashboard Development:</strong> Designed and implemented an interactive React/Next.js dashboard to visualize and manage booking data. <br />
            • <strong>Data Management:</strong> Configured MongoDB to store synchronized booking information for accurate, centralized data access. <br />
            • <strong>Automated Marketing:</strong> Developed a Python automation that triggered targeted email campaigns, boosting bookings during slow periods. <br />
            • <strong>Infrastructure & CI/CD:</strong> Architected and deployed company infrastructure across multiple VPSs, establishing Docker-based CI/CD pipelines with GitHub Actions and comprehensive monitoring using Loki, Grafana, and Prometheus.
          </p>


        </section>
        <section className="mb-16">
          <h2 className={`text-3xl font-bold mb-4 ${jetbrainsMono.className}`}>education</h2>
          <h3 className="text-xl font-bold mb-2">computer programming & analysis</h3>
          <p className="mb-2">
            seneca polytechnic
            <span className="text-muted-foreground"> sep 2023 – current </span>
          </p>
          <p className="mb-2">
            • advanced skills in C++ programming, web development, database management, and project management <br />
            • deep understanding of data structures and algorithms <br />
            • hands-on experience in system analysis and design, multithreaded programming, and automation through scripting <br />
            • strengthened my communication and teamwork abilities through focused courses in business communication and it project management
          </p>
        </section>
        <section className="mb-16">
          <h2 className={`text-3xl font-bold mb-4 ${jetbrainsMono.className}`}>stuff i work with</h2>

          <div className="mb-4">
            <h3 className="text-xl mb-2">general purpose</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">go</Badge>
              <Badge variant="outline">rust</Badge>
              <Badge variant="outline">python</Badge>
              <Badge variant="outline">c++</Badge>
              <Badge variant="outline">shell</Badge>
              <Badge variant="outline">nix</Badge>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xl mb-2">web dev</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">html</Badge>
              <Badge variant="outline">css</Badge>
              <Badge variant="outline">tailwind</Badge>
              <Badge variant="outline">javascript</Badge>
              <Badge variant="outline">typescript</Badge>
              <Badge variant="outline">node</Badge>
              <Badge variant="outline">express</Badge>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xl mb-2">os</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">linux (nixos, ubuntu, debian)</Badge>
              <Badge variant="outline">windows</Badge>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xl mb-2">db&apos;s</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">mysql</Badge>
              <Badge variant="outline">oracledb</Badge>
              <Badge variant="outline">postgres</Badge>
              <Badge variant="outline">mongodb</Badge>
            </div>
          </div>
        </section>
        {/* Projects Section */}
        <section className="mb-16">
          <h2 className={`text-3xl font-bold mb-4 ${jetbrainsMono.className}`}>projects</h2>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2">itanoru</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline">rust</Badge>
              <Badge variant="outline">docker</Badge>
            </div>
            <p className="mb-2">
              rust-based system integrating the telegram API with AI-powered content processing of pinterest boards.
              supports seamless asynchronous operation of concurrent users, with dynamic state management, clean up operations and robust error handling.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2">melchior</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline">go</Badge>
            </div>
            <p className="mb-2">
              cli tool that converts natural language into shell commands. written in go, is performant and easy to use.
              supports a wide range ai models, and can be customized to fit any workflow.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2">aard</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline">typescript</Badge>
              <Badge variant="outline">gtk4</Badge>
              <Badge variant="outline">scss</Badge>
            </div>
            <p className="mb-2">
              a custom desktop shell for linux, written in typescript and using the gtk4 toolkit. follows material design principles, and features a wide range of components.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2">my nixos system configuration</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline">nix</Badge>
              <Badge variant="outline">shell</Badge>
              <Badge variant="outline">typescript</Badge>
            </div>
            <p className="mb-2">
              a modular nixos flake. manages system services, packages, and environments across multiple machines, achiving reproducible builds fully declaratively.
              automated tasks with custom systemd services, and wrote a custom shell script to manage other parts of the sytems.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2">stats-api</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline">java</Badge>
              <Badge variant="outline">python</Badge>
              <Badge variant="outline">docker</Badge>
              <Badge variant="outline">gitHub actions</Badge>
              <Badge variant="outline">postgres</Badge>
            </div>
            <p className="mb-2">
              a java game modification, exposing a rest API to track player statistics, a python app that collects it and pushes to a Postgres
              database, and a dashboard to visualize the data.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2">evo</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline">python</Badge>
              <Badge variant="outline">go</Badge>
              <Badge variant="outline">rust</Badge>
              <Badge variant="outline">typescript</Badge>
              <Badge variant="outline">docker</Badge>
            </div>
            <p className="mb-2">
              discord bot, supports music playback. i experimented with a multitude of stacks, migrating the complex codebase to a new one 3 times,
              improving performance each time.
              developed a cd pipeline with docker and gitHub actions.
              integrated API&apos;s from youtube, spotify, and soundcloud to expand user features.
            </p>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}