import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScanIcon, RecycleIcon, TrendingUpIcon, LeafIcon } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <LeafIcon className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Smart Waste Classification
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Use AI-powered image recognition to identify recyclable, reusable, and trash items instantly. 
            Make sustainable choices with confidence.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-eco shadow-soft hover:shadow-glow transition-all duration-300"
            >
              <Link to="/analysis">
                <ScanIcon className="w-5 h-5 mr-2" />
                Start Analyzing
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="p-6 text-center space-y-4 shadow-soft hover:shadow-glow transition-all duration-300">
            <div className="inline-flex items-center justify-center p-3 bg-recyclable/20 rounded-full">
              <ScanIcon className="w-8 h-8 text-recyclable" />
            </div>
            <h3 className="text-xl font-semibold">Instant Analysis</h3>
            <p className="text-muted-foreground">
              Upload or capture an image and get instant classification results powered by machine learning.
            </p>
          </Card>

          <Card className="p-6 text-center space-y-4 shadow-soft hover:shadow-glow transition-all duration-300">
            <div className="inline-flex items-center justify-center p-3 bg-reusable/20 rounded-full">
              <RecycleIcon className="w-8 h-8 text-reusable" />
            </div>
            <h3 className="text-xl font-semibold">Eco-Friendly Tips</h3>
            <p className="text-muted-foreground">
              Receive actionable recommendations on how to properly dispose or reuse each item.
            </p>
          </Card>

          <Card className="p-6 text-center space-y-4 shadow-soft hover:shadow-glow transition-all duration-300">
            <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full">
              <TrendingUpIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Track Progress</h3>
            <p className="text-muted-foreground">
              Monitor your environmental impact and see your contribution to sustainability over time.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto p-8 text-center bg-gradient-eco shadow-soft">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-white/90 mb-6">
            Join thousands of users making smarter, more sustainable waste decisions every day.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="shadow-soft"
          >
            <Link to="/analysis">
              <ScanIcon className="w-5 h-5 mr-2" />
              Get Started Now
            </Link>
          </Button>
        </Card>
      </section>
    </div>
  );
};

export default Home;
