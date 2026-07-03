import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FaUtensils, FaHeart, FaUsers, FaStar, FaClock, FaGift } from 'react-icons/fa';

const AboutPage = () => {
  const features = [
    { icon: FaUtensils, title: 'Authentic Recipes', description: 'Carefully curated recipes from various cuisines.' },
    { icon: FaHeart, title: 'Made with Love', description: 'Every recipe is crafted with passion and attention to detail.' },
    { icon: FaUsers, title: 'Community Focused', description: 'Join our community of food lovers.' },
    { icon: FaStar, title: 'Quality Content', description: 'High-quality recipes with detailed instructions.' },
    { icon: FaClock, title: 'Time-Saving', description: 'Quick and easy recipes for busy individuals.' },
    { icon: FaGift, title: 'Free Resources', description: 'All recipes and guides are completely free.' },
  ];

  return (
    <>
      <Helmet><title>About Us - Afsheen's Creations</title></Helmet>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-4">About <span className="text-primary-600">Afsheen's</span> Creations</h1>
            <p className="text-lg text-gray-600 leading-relaxed">Welcome to Afsheen's Creations, where culinary passion meets creativity.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div><h2 className="text-3xl font-playfair font-bold text-gray-900 mb-4">Our Story</h2><p className="text-gray-600 leading-relaxed">Afsheen's Creations was born from a simple love for cooking and sharing food with others. Today, we offer a diverse collection of recipes spanning multiple cuisines.</p></div>
              <div className="bg-gradient-to-br from-primary-100 to-pink-100 rounded-2xl p-8 text-center"><div className="text-6xl mb-4">👩‍🍳</div><h3 className="text-2xl font-playfair font-bold text-gray-800">"Cooking is love made visible"</h3></div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-playfair font-bold text-center text-gray-900 mb-12">Why Choose <span className="text-primary-600">Afsheen's</span> Creations?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4"><feature.icon className="text-primary-600 text-2xl" /></div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;