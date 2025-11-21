import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export const CitiesSection = () => {
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

  return (
    <section id="cities" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">We Work in All Major Cities</h2>
          <p className="text-muted-foreground text-lg">
            Currency exchange services available throughout Thailand
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cities.map((city, index) => (
            <Card key={index} className="overflow-hidden bg-card border-border group hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={city.image} 
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  {city.name}
                </h3>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground mb-4">Service areas:</p>
                <div className="flex flex-wrap gap-2">
                  {city.areas.map((area, i) => (
                    <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {area}
                    </span>
                  ))}
                </div>
                <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Contact Us
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
