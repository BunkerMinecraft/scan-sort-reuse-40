import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScanIcon, RecycleIcon, TrendingUpIcon, LeafIcon } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
const Home = () => {
  return <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <LeafIcon className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Smart Waste Classification
          </h1>
          
          <p className="text-xl mb-8 text-black">
            Use AI-powered image recognition to identify recyclable, reusable, and trash items instantly. 
            Make sustainable choices with confidence.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-eco shadow-soft hover:shadow-glow transition-all duration-300">
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
            <h3 className="text-xl font-bold">Instant Analysis</h3>
            <p className="text-black">
              Upload or capture an image and get instant classification results powered by machine learning.
            </p>
          </Card>

          <Card className="p-6 text-center space-y-4 shadow-soft hover:shadow-glow transition-all duration-300">
            <div className="inline-flex items-center justify-center p-3 bg-reusable/20 rounded-full">
              <RecycleIcon className="w-8 h-8 text-reusable" />
            </div>
            <h3 className="text-xl font-bold">Eco-Friendly Tips</h3>
            <p className="text-black">
              Receive actionable recommendations on how to properly dispose or reuse each item.
            </p>
          </Card>

          <Card className="p-6 text-center space-y-4 shadow-soft hover:shadow-glow transition-all duration-300">
            <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full">
              <TrendingUpIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Track Progress</h3>
            <p className="text-black">
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
          <Button asChild size="lg" variant="secondary" className="shadow-soft">
            <Link to="/analysis">
              <ScanIcon className="w-5 h-5 mr-2" />
              Get Started Now
            </Link>
          </Button>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto p-8 rounded-sm shadow-xl opacity-95 border-2 border-green-50">
          <h2 className="text-3xl font-bold text-foreground mb-6">FAQ</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="confidence-score">
              <AccordionTrigger className="text-left font-semibold">
                What is the Confidence Score?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                The confidence score shows how sure the model is about its prediction. It ranges from 0% to 100%, where 0% means no confidence and 100% means full confidence. A higher score means the model is more certain about its classification, helping you decide how reliably you can act on the result.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="confidence-meaning">
              <AccordionTrigger className="text-left font-semibold">
                What does it mean for the confidence score to be low or high?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                A low confidence score (e.g., &lt;50%) means the model is uncertain about its prediction, and you may need to double-check the item. A high confidence score (e.g., &gt;80%) means the model has strong evidence for that classification. This makes it easier to decide which bin to use or whether the item needs additional cleaning before recycling.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="improving-confidence">
              <AccordionTrigger className="text-left font-semibold">
                Tips for Improving the Confidence Score
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4">
                <div>
                  <p className="font-medium text-foreground mb-2">Issues:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>The image is low-resolution or blurry</li>
                    <li>The object is not in focus</li>
                    <li>The lighting is dim or uneven</li>
                    <li>The camera angle makes the item hard to see</li>
                    <li>There are other items in the frame (this can confuse the model)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">Recommendations:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Take the picture in a well-lit area</li>
                    <li>Place the object in the center of the frame and at a clear, readable distance</li>
                    <li>Avoid lighting that is too dim or overly bright</li>
                    <li>Adjust the camera so the object's main features are sharp and visible</li>
                    <li>Remove any extra items so the photo contains only the object you want classified</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </section>
    </div>;
};
export default Home;