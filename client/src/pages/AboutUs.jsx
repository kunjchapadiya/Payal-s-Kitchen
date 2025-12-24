import React from 'react';
import { FaUtensils, FaHeart, FaAward, FaUsers } from 'react-icons/fa';
import Card from '../../components/Card';

const AboutUs = () => {
  const values = [
    { icon: FaUtensils, title: 'Fresh Ingredients', desc: 'We use only the freshest, locally-sourced ingredients' },
    { icon: FaHeart, title: 'Made with Love', desc: 'Every dish is prepared with care and passion' },
    { icon: FaAward, title: 'Quality First', desc: 'We never compromise on quality and taste' },
    { icon: FaUsers, title: 'Customer Focused', desc: 'Your satisfaction is our top priority' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E7] font-[Poppins]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#F28C28] to-orange-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">About Payal's Kitchen</h1>
          <p className="text-xl max-w-2xl mx-auto">Bringing the taste of home-cooked meals to your doorstep since 2020</p>
        </div>
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#2E2E2E] mb-6 text-center">Our Story</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            Payal's Kitchen started with a simple mission: to provide delicious, home-style meals to people who miss the comfort of home-cooked food. What began as a small tiffin service has grown into a full-fledged food delivery and catering business.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Today, we serve hundreds of satisfied customers daily, offering everything from daily meal subscriptions to event catering services. Our commitment to quality, taste, and customer satisfaction remains unchanged.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#2E2E2E] mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} hover className="text-center">
                <div className="w-16 h-16 bg-[#F28C28] rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
