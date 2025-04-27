import { 
  CreditCard, 
  Users, 
  Shield, 
  Briefcase,
  Building2,
  CheckCircle2,
  XCircle
} from "lucide-react";

export default function ComparePlansPage() {
  const plans = [
    {
      name: "Ulster Delt Standard",
      icon: CreditCard,
      price: "Free",
      features: {
        "No monthly fees": true,
        "Basic banking features": true,
        "Contactless card": true,
        "Mobile banking": true,
        "24/7 customer support": true,
        "Cashback rewards": false,
        "Premium concierge": false,
        "Travel insurance": false,
        "Airport lounge access": false,
      }
    },
    {
      name: "Ulster Delt Smart",
      icon: Users,
      price: "£5/month",
      features: {
        "No monthly fees": false,
        "Basic banking features": true,
        "Contactless card": true,
        "Mobile banking": true,
        "24/7 customer support": true,
        "Cashback rewards": true,
        "Premium concierge": false,
        "Travel insurance": false,
        "Airport lounge access": false,
      }
    },
    {
      name: "Ulster Delt Metal",
      icon: Shield,
      price: "£15/month",
      features: {
        "No monthly fees": false,
        "Basic banking features": true,
        "Contactless card": true,
        "Mobile banking": true,
        "24/7 customer support": true,
        "Cashback rewards": true,
        "Premium concierge": true,
        "Travel insurance": true,
        "Airport lounge access": true,
      }
    },
    {
      name: "Ulster Delt Business",
      icon: Briefcase,
      price: "£10/month",
      features: {
        "No monthly fees": false,
        "Basic banking features": true,
        "Contactless card": true,
        "Mobile banking": true,
        "24/7 customer support": true,
        "Cashback rewards": true,
        "Premium concierge": false,
        "Travel insurance": true,
        "Airport lounge access": false,
      }
    },
    {
      name: "Ulster Delt You",
      icon: Building2,
      price: "Custom",
      features: {
        "No monthly fees": false,
        "Basic banking features": true,
        "Contactless card": true,
        "Mobile banking": true,
        "24/7 customer support": true,
        "Cashback rewards": true,
        "Premium concierge": true,
        "Travel insurance": true,
        "Airport lounge access": true,
      }
    }
  ];

  const features = Object.keys(plans[0].features);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Compare Plans</h1>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-4 text-left">Features</th>
                {plans.map((plan) => (
                  <th key={plan.name} className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <plan.icon className="h-6 w-6 text-primary mb-2" />
                      <span className="font-semibold">{plan.name}</span>
                      <span className="text-gray-600">{plan.price}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature} className="border-t">
                  <td className="p-4">{feature}</td>
                  {plans.map((plan) => (
                    <td key={`${plan.name}-${feature}`} className="p-4 text-center">
                      {plan.features[feature] ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Need Help Choosing?</h2>
          <p className="text-gray-600 mb-4">
            Our team is here to help you find the perfect plan for your needs.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/contact" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90">
              Contact Us
            </a>
            <a href="/products" className="border border-primary text-primary px-6 py-2 rounded-md hover:bg-primary/5">
              View All Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 