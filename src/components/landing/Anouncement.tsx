import { Button } from "@/components/ui/button";
import Image from "next/image";

const announcements = [
  {
    title: "Pembaruan Ketentuan UMKM",
    description: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    image: "/hero.png"
  },
  {
    title: "Pembaruan Ketentuan UMKM",
    description: "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing.",
    image: "/hero.png"
  },
  {
    title: "Pembaruan Ketentuan UMKM",
    description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
    image: "/hero.png"
  },
]

export default function AnnouncementsSection() {
  return (
    <section className="py-12 md:py-20 ">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Pengumuman
        </h2>
        <div className="space-y-12">
          {announcements.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
              <div className="relative w-full h-50 rounded-md overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="outline" type="button" className="border-primary hover:cursor-pointer py-6 px-10 text-primary hover:bg-pink-50 hover:text-primary">
            Selengkapnya
          </Button>
        </div>
      </div>
    </section>
  );
}