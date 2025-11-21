import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { getReadableTextColor } from "@/lib/utils";

const badgePalette = ["#ecfdf3", "#e0f2fe", "#fef3c7", "#f1f5f9", "#fee2e2", "#ede9fe"];

const cities = [
  {
    name: "Phuket",
    areas: ["Patong", "Kata", "Karon", "Rawai", "Chalong"],
    image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80"
  },
  {
    name: "Bangkok",
    areas: ["Sukhumvit", "Silom", "Sathorn", "Ratchada", "Thonglor"],
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80"
  },
  {
    name: "Pattaya",
    areas: ["Central Pattaya", "Jomtien", "Naklua", "Pratumnak"],
    image: "https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?w=800&q=80"
  },
  {
    name: "Samui",
    areas: ["Chaweng", "Lamai", "Bophut", "Mae Nam"],
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80"
  },
  {
    name: "Chiang Mai",
    areas: ["Old City", "Nimman", "Santitham", "Hang Dong"],
    image: "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=800&q=80"
  },
  {
    name: "Hua Hin",
    areas: ["Center", "Khao Takiab", "Cha-Am"],
    image: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=800&q=80"
  }
];

export const CitiesSection = () => {
  return (
    <section id="cities" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            Thailand coverage
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
            Wherever you land, the desk is already there
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Private couriers and FET-ready support in all major Thai cities.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cities.map((city, index) => (
            <Card
              key={city.name}
              className="group overflow-hidden border border-white/70 bg-white/85 shadow-xl shadow-slate-200/60 backdrop-blur"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={city.image}
                  alt={city.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                <div className="absolute inset-6 flex items-center gap-3 text-white">
                  <MapPin className="h-5 w-5 text-emerald-200" />
                  <p className="text-lg font-semibold">{city.name}</p>
                </div>
              </div>
              <div className="space-y-5 p-6">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">
                  Service areas
                </p>
                <div className="flex flex-wrap gap-2">
                  {city.areas.map((area, areaIndex) => {
                    const backgroundColor = badgePalette[(index + areaIndex) % badgePalette.length];
                    const textColor = getReadableTextColor(backgroundColor);
                    return (
                      <span
                        key={area}
                        className="rounded-full px-3 py-1 text-xs font-semibold shadow-sm"
                        style={{ backgroundColor, color: textColor }}
                      >
                        {area}
                      </span>
                    );
                  })}
                </div>
                <Button asChild className="w-full rounded-2xl">
                  <a href="#contacts">Book courier</a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
