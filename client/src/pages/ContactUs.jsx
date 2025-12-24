import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useToast } from '../components/Toast';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const { success } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    success('Message sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const contactInfo = [
    { icon: FaPhone, title: 'Phone', value: '+91 98765 43210', link: 'tel:+919876543210' },
    { icon: FaEnvelope, title: 'Email', value: 'hello@payalskitchen.com', link: 'mailto:hello@payalskitchen.com' },
    { icon: FaMapMarkerAlt, title: 'Address', value: '123 Food Street, Mumbai, India' },
    { icon: FaClock, title: 'Hours', value: 'Mon-Sun: 8:00 AM - 10:00 PM' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E7] font-[Poppins] py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-[#2E2E2E] mb-12 text-center">Contact Us</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card>
            <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows="4"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F28C28]/20 focus:border-[#F28C28] transition-all"
                />
              </div>
              <Button type="submit" variant="primary" fullWidth>Send Message</Button>
            </form>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6">Get in Touch</h2>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#F28C28]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <info.icon className="text-[#F28C28]" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2E2E2E]">{info.title}</h3>
                      {info.link ? (
                        <a href={info.link} className="text-gray-600 hover:text-[#F28C28]">{info.value}</a>
                      ) : (
                        <p className="text-gray-600">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-[#F28C28] to-orange-600 text-white">
              <h3 className="text-xl font-bold mb-2">Need Help?</h3>
              <p className="mb-4">Our customer support team is always ready to assist you.</p>
              <Button variant="secondary">Chat with Us</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
