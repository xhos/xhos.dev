import Image from 'next/image';
import Link from 'next/link';

type ProjectProps = {
  name: string;
  img: string;
  link: string;
};

export default function Project({ name, img, link }: ProjectProps) {
  return (
    <div className="relative">
      <Link href={link}>
        <div className="relative">
          <Image alt={name} width="1920" height="1080" src={img} className="w-full h-full" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/70 to-transparent" />
          {/* Project name overlay */}
          <div className="absolute bottom-0 left-0 p-4">
            <span className="text-white font-medium">{name}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};