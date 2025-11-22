import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

export const BlogSection = () => {
  const posts = [
    {
      title: "How to Buy Property in Nepal: Complete Guide",
      excerpt: "Everything you need to know about purchasing real estate in Nepal as a foreigner, including regulatory requirements and legal considerations.",
      date: "March 15, 2025",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      category: "Real Estate"
    },
    {
      title: "Best Time to Exchange Currency in Nepal",
      excerpt: "Learn about currency exchange patterns, optimal timing, and how to get the best rates throughout the year.",
      date: "March 10, 2025",
      image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&q=80",
      category: "Currency Tips"
    },
    {
      title: "Understanding Foreign Exchange Regulations in Nepal",
      excerpt: "A detailed guide to Foreign Exchange Transaction documentation - what you need, why you need it, and how to obtain it.",
      date: "March 5, 2025",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
      category: "Legal"
    }
  ];

  return (
    <section id="blog" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Latest News & Articles</h2>
          <p className="text-muted-foreground text-lg">
            Helpful guides and updates about currency exchange in Nepal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Card key={index} className="overflow-hidden bg-card border-border group hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <Button variant="ghost" className="group/btn p-0 h-auto text-primary hover:text-primary/80">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
};
