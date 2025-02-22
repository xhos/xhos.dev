
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Project from "@/components/project";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Carousel className="items-center">
          <CarouselContent>
            <CarouselItem><Project link="https://github.com/xhos/stats-analysis" name="stats" img="https://private-user-images.githubusercontent.com/60789741/366278284-1edce8d3-1009-49fb-a00d-948a40dfc730.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDAxOTQxMzAsIm5iZiI6MTc0MDE5MzgzMCwicGF0aCI6Ii82MDc4OTc0MS8zNjYyNzgyODQtMWVkY2U4ZDMtMTAwOS00OWZiLWEwMGQtOTQ4YTQwZGZjNzMwLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTAyMjIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMjIyVDAzMTAzMFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTFhMjNkMzMzYjdjZWNmNjA1MGZjOWIyODNiOTBmM2MzYmVjNzVlY2I1YmEzMmJlYjc5ZWMxOGI0MzUzZmMzZjcmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.gy2BTA7iv8Rk4MY0DrvCePe8OXMQmolKRbZg2QrjrEo" /></CarouselItem>
            <CarouselItem><Project link="https://github.com/xhos/stats-analysis" name="stats" img="https://private-user-images.githubusercontent.com/60789741/366278284-1edce8d3-1009-49fb-a00d-948a40dfc730.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDAxOTQxMzAsIm5iZiI6MTc0MDE5MzgzMCwicGF0aCI6Ii82MDc4OTc0MS8zNjYyNzgyODQtMWVkY2U4ZDMtMTAwOS00OWZiLWEwMGQtOTQ4YTQwZGZjNzMwLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTAyMjIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMjIyVDAzMTAzMFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTFhMjNkMzMzYjdjZWNmNjA1MGZjOWIyODNiOTBmM2MzYmVjNzVlY2I1YmEzMmJlYjc5ZWMxOGI0MzUzZmMzZjcmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.gy2BTA7iv8Rk4MY0DrvCePe8OXMQmolKRbZg2QrjrEo" /></CarouselItem>
            <CarouselItem><Project link="https://github.com/xhos/stats-analysis" name="stats" img="https://private-user-images.githubusercontent.com/60789741/366278284-1edce8d3-1009-49fb-a00d-948a40dfc730.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDAxOTQxMzAsIm5iZiI6MTc0MDE5MzgzMCwicGF0aCI6Ii82MDc4OTc0MS8zNjYyNzgyODQtMWVkY2U4ZDMtMTAwOS00OWZiLWEwMGQtOTQ4YTQwZGZjNzMwLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTAyMjIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMjIyVDAzMTAzMFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTFhMjNkMzMzYjdjZWNmNjA1MGZjOWIyODNiOTBmM2MzYmVjNzVlY2I1YmEzMmJlYjc5ZWMxOGI0MzUzZmMzZjcmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.gy2BTA7iv8Rk4MY0DrvCePe8OXMQmolKRbZg2QrjrEo" /></CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

      </main>

    </div>
  );
}
