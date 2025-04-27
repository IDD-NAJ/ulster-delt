import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BanknotesIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  HomeIcon,
  BriefcaseIcon,
  PresentationChartLineIcon,
  CalculatorIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function BankPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 py-16 sm:py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
              Banking Solutions for Every Need
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover our comprehensive range of banking services designed to help you achieve your financial goals
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Open an Account
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Core Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Personal Banking',
              description: 'Everyday banking solutions including checking, savings, and digital banking services.',
              icon: BanknotesIcon,
              color: 'bg-blue-100 text-blue-600',
              features: ['Free checking accounts', 'High-yield savings', 'Mobile banking'],
            },
            {
              title: 'Credit Cards',
              description: 'Rewards credit cards with competitive rates and exclusive benefits.',
              icon: CreditCardIcon,
              color: 'bg-purple-100 text-purple-600',
              features: ['Cashback rewards', 'Travel benefits', 'Zero liability protection'],
            },
            {
              title: 'Mortgages',
              description: 'Home financing solutions with competitive rates and flexible terms.',
              icon: HomeIcon,
              color: 'bg-green-100 text-green-600',
              features: ['Fixed & variable rates', 'First-time buyer programs', 'Refinancing options'],
            },
            {
              title: 'Business Banking',
              description: 'Comprehensive financial solutions for businesses of all sizes.',
              icon: BriefcaseIcon,
              color: 'bg-orange-100 text-orange-600',
              features: ['Business checking', 'Merchant services', 'Business loans'],
            },
            {
              title: 'Investments',
              description: 'Expert guidance and diverse investment opportunities for your future.',
              icon: PresentationChartLineIcon,
              color: 'bg-indigo-100 text-indigo-600',
              features: ['Retirement planning', 'Investment accounts', 'Wealth management'],
            },
            {
              title: 'International Banking',
              description: 'Global banking solutions for your international financial needs.',
              icon: GlobeAltIcon,
              color: 'bg-teal-100 text-teal-600',
              features: ['Foreign exchange', 'International transfers', 'Multi-currency accounts'],
            },
          ].map((service) => (
            <Card key={service.title} className="p-6 hover:shadow-xl transition-all duration-300">
              <div className={`p-3 rounded-full ${service.color} w-fit mb-4`}>
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">Learn More</Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Tools & Resources */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Tools & Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Loan Calculator',
                description: 'Calculate your monthly payments and interest rates',
                icon: CalculatorIcon,
              },
              {
                title: 'Financial Planning',
                description: 'Tools and guides for your financial journey',
                icon: DocumentTextIcon,
              },
              {
                title: 'Security Center',
                description: 'Learn about our security measures and stay protected',
                icon: ShieldCheckIcon,
              },
              {
                title: 'Market Updates',
                description: 'Stay informed with latest market insights',
                icon: ArrowTrendingUpIcon,
              },
            ].map((tool) => (
              <Card 
                key={tool.title} 
                className="p-6 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <tool.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-medium">{tool.title}</h3>
                </div>
                <p className="text-sm text-gray-500">{tool.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us with their banking needs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Open an Account
            </Button>
            <Button size="lg" variant="outline">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
} 