import React from 'react';
import { Heart, Users, Camera, Shield, Sparkles } from 'lucide-react';

export function WelcomeSection() {
  const features = [
    {
      icon: Camera,
      title: 'Capture Every Moment',
      description: 'Photos, videos, and stories - all in one safe place'
    },
    {
      icon: Users,
      title: 'Family Collaboration',
      description: 'Everyone can contribute to your family\'s story'
    },
    {
      icon: Shield,
      title: 'Private & Secure',
      description: 'Your memories are protected with advanced security'
    },
    {
      icon: Sparkles,
      title: 'Memory Games',
      description: 'Fun activities to help with memory recall'
    }
  ];

  return (
    <div className="flex flex-col justify-center h-full p-8 lg:p-12">
      {/* Main Welcome Message */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-lg mr-4">
            <img
              src="/logo.png"
              alt="Yaadein Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-2 app-name">
              Yaadein
            </h1>
            <p className="text-xl text-sage-100">
              Where Family Stories Live Forever
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
            Preserve Your Family's
            <br />
            <span className="text-sage-200">Precious Memories</span>
          </h2>
          
          <p className="text-xl text-sage-100 leading-relaxed max-w-2xl">
            Yaadein helps families stay connected through shared memories. 
            Perfect for keeping loved ones close, especially those dealing with 
            memory challenges. Every photo, story, and moment matters.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sage-100 text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="mt-12 pt-8 border-t border-white border-opacity-20">
        <div className="flex flex-wrap items-center justify-center gap-8 text-sage-100">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span className="text-base">HIPAA Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5" />
            <span className="text-base">Family Focused</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span className="text-base">Trusted by 10,000+ Families</span>
          </div>
        </div>
      </div>
    </div>
  );
}