"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { FaBullhorn, FaCode, FaRobot, FaChevronDown, FaChartLine, FaGraduationCap, FaGlobe, FaLightbulb, FaShoppingCart, FaEnvelope, FaSearch, FaUserFriends, FaVideo, FaNewspaper, FaCube } from "react-icons/fa";

type Service = {
  id: string;
  name: string;
  tagline: string;
  icon: ComponentType<{ className?: string }>;
  href: string;
  points: string[];
  price?: string;
  subServices?: { name: string; href: string; description: string }[];
};

const STATIC_SERVICES: Service[] = [
  {
    id: "automation-workflow",
    name: "Automation Workflow / AI Agents",
    tagline: "Transform your business with intelligent automation and AI-powered workflows",
    icon: FaRobot,
    href: "/services/ai-automation",
    points: [
      "Custom AI agent development",
      "Workflow automation solutions",
      "Process optimization with AI",
      "Intelligent customer service bots",
      "Data-driven decision making",
    ],
    price: "45000",
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    tagline: "Comprehensive digital marketing strategies to grow your brand and reach",
    icon: FaBullhorn,
    href: "/services/digital-marketing",
    points: [
      "Multi-channel marketing campaigns",
      "Data-driven strategy development",
      "ROI-focused marketing solutions",
      "Brand awareness and growth",
    ],
    price: "35000",
    subServices: [
      { name: "Social Media", href: "/services/social-media-marketing", description: "Strategic social media management and campaigns" },
      { name: "Content Creation", href: "/services/content-writing", description: "Engaging content that converts and resonates" },
      { name: "Influencer Marketing", href: "/services/influencer-marketing", description: "Connect with your audience through influencers" },
      { name: "SEO Optimization", href: "/services/seo", description: "Improve your search rankings and organic traffic" },
      { name: "Community Management", href: "/services/community-management", description: "Build and nurture your online community" },
      { name: "Email Marketing", href: "/services/email-marketing", description: "Targeted email campaigns that drive results" },
      { name: "E-Commerce", href: "/services/ecommerce", description: "Online store setup and optimization" },
    ],
  },
  {
    id: "web-app-development",
    name: "Web / App Development",
    tagline: "Custom web and mobile applications built for performance and scalability",
    icon: FaCode,
    href: "/services/website-development",
    points: [
      "Custom web applications",
      "Mobile app development",
      "E-commerce platforms",
      "API development and integration",
      "Progressive Web Apps (PWA)",
    ],
    price: "55000",
  },
  {
    id: "branding",
    name: "Branding",
    tagline: "Create a powerful brand identity that stands out in the market",
    icon: FaLightbulb,
    href: "/services/branding",
    points: [
      "Brand strategy and positioning",
      "Visual identity design",
      "Logo and brand guidelines",
      "Brand messaging and tone",
      "Market research and analysis",
    ],
    price: "40000",
  },
  {
    id: "lead-generation",
    name: "Lead Generation",
    tagline: "Generate high-quality leads that convert into loyal customers",
    icon: FaChartLine,
    href: "/services/lead-generation",
    points: [
      "Targeted lead generation campaigns",
      "Landing page optimization",
      "Sales funnel development",
      "Lead nurturing strategies",
      "Conversion rate optimization",
    ],
    price: "30000",
  },
  {
    id: "geo-marketing",
    name: "GEO Marketing",
    tagline: "Location-based marketing strategies to reach local customers effectively",
    icon: FaGlobe,
    href: "/services/geo-marketing",
    points: [
      "Local SEO optimization",
      "Geotargeted advertising",
      "Location-based campaigns",
      "Regional market analysis",
      "Local business listings",
    ],
    price: "25000",
  },
];

const COURSES = [
  {
    id: "digital-marketing-course",
    name: "Digital Marketing Course",
    tagline: "Master the art of digital marketing from basics to advanced strategies",
    icon: FaGraduationCap,
    href: "/courses/digital-marketing",
    points: [
      "Social media marketing mastery",
      "SEO and content marketing",
      "Paid advertising campaigns",
      "Analytics and reporting",
      "Brand strategy development",
    ],
    price: "15000",
  },
  {
    id: "ai-automation-workflows",
    name: "AI Automation & Workflows",
    tagline: "Learn to build intelligent automation systems and AI-powered workflows",
    icon: FaRobot,
    href: "/courses/ai-automation",
    points: [
      "AI agent development",
      "Workflow automation tools",
      "Process optimization techniques",
      "Integration with existing systems",
      "Real-world implementation",
    ],
    price: "20000",
  },
  {
    id: "ai-journalist-programme",
    name: "AI Journalist Programme",
    tagline: "Become an AI-powered content creator and digital journalist",
    icon: FaNewspaper,
    href: "/courses/ai-journalist",
    points: [
      "AI-powered content creation",
      "Automated journalism techniques",
      "Data storytelling",
      "Ethical AI in media",
      "Content strategy with AI",
    ],
    price: "18000",
  },
  {
    id: "product-building-ai",
    name: "Product Building with AI",
    tagline: "Learn to develop innovative products using artificial intelligence",
    icon: FaCube,
    href: "/courses/product-building",
    points: [
      "AI product design principles",
      "Machine learning integration",
      "Product development lifecycle",
      "User experience with AI",
      "Market validation strategies",
    ],
    price: "25000",
  },
  {
    id: "ads-movies-creation-ai",
    name: "Ads and Movies Creation with AI",
    tagline: "Master AI-powered video creation for advertisements and entertainment",
    icon: FaVideo,
    href: "/courses/ai-video-creation",
    points: [
      "AI video generation tools",
      "Script writing with AI",
      "Visual effects and editing",
      "Advertisement creation",
      "Storytelling techniques",
    ],
    price: "22000",
  },
  {
    id: "foundation-of-ai",
    name: "Foundation of AI",
    tagline: "Build a strong foundation in artificial intelligence and machine learning",
    icon: FaLightbulb,
    href: "/courses/ai-foundation",
    points: [
      "AI fundamentals and concepts",
      "Machine learning basics",
      "Neural networks and deep learning",
      "Practical AI applications",
      "Ethics in AI development",
    ],
    price: "12000",
  },
];

export default function Services() {
  const [services, setServices] = useState<Service[]>(STATIC_SERVICES);
  const [courses, setCourses] = useState(COURSES);
  const [loading, setLoading] = useState(false);
  const [expandedService, setExpandedService] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/services');
        const data = await response.json();
        if (data.success && data.services?.length > 0) {
          setServices(data.services);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const toggleExpanded = (serviceId: string) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions to transform your business with cutting-edge technology and strategic expertise
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading services...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const Icon = service.icon;
                const hasSubServices = service.subServices && service.subServices.length > 0;
                const isExpanded = expandedService === service.id;

                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <Icon className="h-8 w-8 text-yellow-500 mr-3" />
                        <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{service.tagline}</p>
                      
                      <ul className="space-y-2 mb-6">
                        {service.points.slice(0, isExpanded ? undefined : 3).map((point, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-2 w-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700 text-sm">{point}</span>
                          </li>
                        ))}
                      </ul>

                      {hasSubServices && isExpanded && (
                        <div className="mb-6 space-y-2">
                          <h4 className="font-semibold text-gray-900 mb-2">Sub-Services:</h4>
                          {service.subServices!.map((subService, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                              <Link
                                href={subService.href}
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                              >
                                {subService.name}
                              </Link>
                              <p className="text-gray-600 text-xs mt-1">{subService.description}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        {service.price && (
                          <span className="text-2xl font-bold text-gray-900">
                            ₹{parseInt(service.price).toLocaleString()}
                          </span>
                        )}
                        
                        <div className="flex gap-2">
                          {hasSubServices && (
                            <button
                              onClick={() => toggleExpanded(service.id)}
                              className="text-yellow-600 hover:text-yellow-700 p-2"
                            >
                              <FaChevronDown className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                          <Link
                            href={service.href}
                            className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors text-sm font-medium"
                          >
                            Learn More
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Courses</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upskill yourself with our comprehensive courses designed by industry experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const Icon = course.icon;
              
              return (
                <div
                  key={course.id}
                  className="bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <Icon className="h-8 w-8 text-yellow-500 mr-3" />
                      <h3 className="text-xl font-bold text-gray-900">{course.name}</h3>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{course.tagline}</p>
                    
                    <ul className="space-y-2 mb-6">
                      {course.points.slice(0, 3).map((point, index) => (
                        <li key={index} className="flex items-start">
                          <div className="h-2 w-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{point}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between">
                      {course.price && (
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{parseInt(course.price).toLocaleString()}
                        </span>
                      )}
                      
                      <Link
                        href={course.href}
                        className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors text-sm font-medium"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get in touch with us to discuss how our services and courses can help you achieve your goals
          </p>
          <Link
            href="/contact"
            className="bg-yellow-400 text-black px-8 py-3 rounded-lg hover:bg-yellow-500 transition-colors text-lg font-medium inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
