import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Camera, Users, Shield, Gamepad2, Search, X, ChevronRight, Calendar, MessageCircle, Upload, Star, ArrowRight, Video, FileText, Sparkles, User, Brain, UserPlus } from 'lucide-react';
import { TouchOptimized } from '../components/ui/TouchOptimized';
import { SparklesCore } from '../components/ui/sparkles';

export function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);
  const [demoTab, setDemoTab] = useState<'timeline' | 'upload' | 'games' | 'family'>('timeline');
  
  const features = [
    {
      icon: Camera,
      title: 'Capture Every Moment',
      description: 'Photos, videos, and stories - all in one safe place',
    },
    {
      icon: Users,
      title: 'Family Collaboration',
      description: 'Everyone can contribute to your family\'s story',
    },
    {
      icon: Search,
      title: 'AI Organization',
      description: 'Smart tagging and search makes finding memories effortless.',
    },
    {
      icon: Gamepad2,
      title: 'Memory Games',
      description: 'Engaging activities to help with memory recall and cognitive wellness.',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your memories are secure with advanced privacy controls.',
    },
  ];

  const handleViewDemo = () => {
    setShowDemo(true);
  };

  const renderDemoContent = () => {
    switch (demoTab) {
      case 'timeline':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Memory Timeline</h3>
            <p className="text-gray-600 mb-4">
              Browse through your family's memories chronologically, with smart organization and filtering.
            </p>
            
            <div className="bg-sage-50 rounded-xl p-4 border border-sage-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-sage-600" />
                  <h4 className="font-semibold text-gray-900">December 2024</h4>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-500 hover:text-gray-700 bg-white rounded-md">
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-gray-700 bg-white rounded-md">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {/* Memory Card 1 */}
                <div className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex">
                    <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src="https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=400" 
                        alt="Christmas Morning" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <h5 className="font-medium text-gray-900">Christmas Morning</h5>
                      <p className="text-xs text-gray-500">December 25, 2024</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Family</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Holiday</span>
                      </div>
                      <div className="flex items-center space-x-3 mt-2 text-gray-500 text-xs">
                        <div className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          <span>24</span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          <span>8</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Memory Card 2 */}
                <div className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex">
                    <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src="https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400" 
                        alt="Family Reunion" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <h5 className="font-medium text-gray-900">Family Reunion</h5>
                      <p className="text-xs text-gray-500">December 15, 2024</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Family</span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Reunion</span>
                      </div>
                      <div className="flex items-center space-x-3 mt-2 text-gray-500 text-xs">
                        <div className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          <span>42</span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          <span>15</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Memory Card 3 */}
                <div className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex">
                    <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="ml-3 flex-1">
                      <h5 className="font-medium text-gray-900">Grandma's Stories</h5>
                      <p className="text-xs text-gray-500">December 10, 2024</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Audio</span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">History</span>
                      </div>
                      <div className="flex items-center space-x-3 mt-2 text-gray-500 text-xs">
                        <div className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          <span>18</span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          <span>6</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'upload':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Upload Memories</h3>
            <p className="text-gray-600 mb-4">
              Easily upload photos, videos, audio recordings, or written stories to preserve your family history.
            </p>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-sage-700 p-2 rounded-lg">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900">Upload Memory</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors">
                  <Camera className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-blue-700">Take Photo</span>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-100 transition-colors">
                  <Video className="w-8 h-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-purple-700">Record Video</span>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-green-100 transition-colors">
                  <MessageCircle className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-700">Record Audio</span>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-100 transition-colors">
                  <FileText className="w-8 h-8 text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-orange-700">Write Story</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>AI will automatically tag people, places, and objects in your memories</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'games':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Memory Games</h3>
            <p className="text-gray-600 mb-4">
              Engage with fun cognitive activities designed to strengthen memory and family connections.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="bg-blue-600 aspect-video flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="p-4">
                  <h5 className="font-semibold text-gray-900 mb-1">Who is This?</h5>
                  <p className="text-xs text-gray-600 mb-2">Test your ability to recognize family members</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Medium</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <Star className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="bg-green-600 aspect-video flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-white" />
                </div>
                <div className="p-4">
                  <h5 className="font-semibold text-gray-900 mb-1">When Was This?</h5>
                  <p className="text-xs text-gray-600 mb-2">Guess when family photos were taken</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Hard</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <Star className="w-4 h-4 text-gray-300" />
                      <Star className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-purple-800">Cognitive Benefits</h4>
              </div>
              <p className="text-sm text-purple-700">
                Our games are designed to strengthen memory recall, facial recognition, and temporal awareness
                while creating meaningful family interactions.
              </p>
            </div>
          </div>
        );
      
      case 'family':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Family Collaboration</h3>
            <p className="text-gray-600 mb-4">
              Invite family members to contribute memories and interact with shared content.
            </p>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Family Members</h4>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-sage-200 rounded-full flex items-center justify-center">
                      <span className="text-sage-700 font-medium">M</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Mom</p>
                      <p className="text-xs text-gray-500">Admin • Mother</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Online</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-sage-200 rounded-full flex items-center justify-center">
                      <span className="text-sage-700 font-medium">D</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Dad</p>
                      <p className="text-xs text-gray-500">Member • Father</p>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">2h ago</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-sage-200 rounded-full flex items-center justify-center">
                      <span className="text-sage-700 font-medium">G</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Grandma</p>
                      <p className="text-xs text-gray-500">Member • Grandmother</p>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">1d ago</span>
                </div>
              </div>
              
              <button className="flex items-center justify-center space-x-2 w-full bg-sage-700 text-white p-3 rounded-lg hover:bg-sage-800 transition-colors">
                <UserPlus className="w-5 h-5" />
                <span>Invite Family Member</span>
              </button>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center space-x-2 mb-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Family Communication</h4>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Stay connected with integrated messaging, memory requests, and activity notifications.
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <button className="bg-white text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                  Message Family
                </button>
                <button className="bg-white text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                  Request Memory
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Sparkles Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sage-700 via-sage-600 to-sage-800">
        {/* Sparkles Background */}
        <div className="absolute inset-0">
          <SparklesCore
            id="landing-sparkles"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={70}
            className="w-full h-full"
            particleColor="#FFFFFF"
            speed={0.5}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full mb-6 shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 app-name">
              Yaadein
            </h1>
            
            <p className="text-xl sm:text-2xl text-sage-100 mb-8 max-w-3xl mx-auto">
              Preserve, organize, and share your family's precious memories. 
              A collaborative platform designed with love for families dealing with memory challenges.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/auth"
                className="w-full sm:w-auto bg-white text-sage-700 px-8 py-4 rounded-xl font-medium text-lg hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sage-700"
              >
                Get Started Free
              </Link>
              <TouchOptimized>
                <button
                  onClick={handleViewDemo}
                  className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-white hover:bg-opacity-10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sage-700"
                >
                  View Demo
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-sage-700 p-2 rounded-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 app-name">Yaadein Interactive Demo</h2>
                </div>
              </div>
              <TouchOptimized>
                <button 
                  onClick={() => setShowDemo(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </TouchOptimized>
            </div>
            
            <div className="flex-1 overflow-auto">
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
                  <TouchOptimized>
                    <button
                      onClick={() => setDemoTab('timeline')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        demoTab === 'timeline'
                          ? 'bg-sage-700 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Timeline</span>
                      </div>
                    </button>
                  </TouchOptimized>
                  
                  <TouchOptimized>
                    <button
                      onClick={() => setDemoTab('upload')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        demoTab === 'upload'
                          ? 'bg-sage-700 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Upload className="w-4 h-4" />
                        <span>Upload</span>
                      </div>
                    </button>
                  </TouchOptimized>
                  
                  <TouchOptimized>
                    <button
                      onClick={() => setDemoTab('games')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        demoTab === 'games'
                          ? 'bg-sage-700 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Gamepad2 className="w-4 h-4" />
                        <span>Games</span>
                      </div>
                    </button>
                  </TouchOptimized>
                  
                  <TouchOptimized>
                    <button
                      onClick={() => setDemoTab('family')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        demoTab === 'family'
                          ? 'bg-sage-700 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Family</span>
                      </div>
                    </button>
                  </TouchOptimized>
                </div>
                
                {/* Demo Content */}
                <div className="mb-6">
                  {renderDemoContent()}
                </div>
                
                <div className="bg-gradient-to-r from-sage-50 to-sage-100 rounded-xl p-6 border border-sage-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Try it yourself!</h4>
                  <p className="text-gray-700 mb-4">
                    Create a free account to experience the full power of Yaadein for your family.
                  </p>
                  <Link
                    to="/auth"
                    className="inline-flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 transition-colors"
                  >
                    <span>Sign Up Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  No credit card required. Free for families.
                </p>
                <TouchOptimized>
                  <button
                    onClick={() => setShowDemo(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Close Demo
                  </button>
                </TouchOptimized>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Preserve Family Memories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for families, with accessibility and ease of use at the forefront.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-sage-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="bg-sage-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 sm:py-24 bg-sage-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 app-name">
            Start Preserving Your Family Memories Today
          </h2>
          <p className="text-xl text-sage-100 mb-8">
            Join families around the world who are keeping their stories alive with Yaadein.
          </p>
          <Link
            to="/auth"
            className="inline-block bg-white text-sage-700 px-8 py-4 rounded-xl font-medium text-lg hover:bg-sage-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sage-700"
          >
            Create Your Family's Memory Collection
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-sage-800 text-sage-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="w-6 h-6" />
              <span className="text-xl font-bold app-name">Yaadein</span>
            </div>
            <p className="text-sage-300 text-center md:text-right">
              © 2025 Yaadein. Built with love for families everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}