import React, { useState, useEffect } from 'react';
import { Card, Col, Row } from "antd";

import image1 from "../../../assets/chairman-sir-photo.2e16d0ba.fill-385x482-c0.format-webp.jpg";
import image4 from "../../../assets/dmd-sir-photo.2e16d0ba.fill-385x482-c0.format-webp.jpg";
import image2 from "../../../assets/Managing_Director_.2e16d0ba.fill-385x482-c0.format-webp.jpg";
import image3 from "../../../assets/vc-sign-photo.2e16d0ba.fill-385x482-c0.format-webp.jpg";

const teamMembers = [
  {
    name: "Abdul Wahed",
    designation: "Chairman",
    image: image1,
  },
  {
    name: "M. A. Jabbar",
    designation: "Managing Director",
    image: image2,
  },
  {
    name: "M. A. Rahim",
    designation: "Vice Chairman",
    image: image3,
  },
  {
    name: "M. A. Quader",
    designation: "Deputy Managing Director & Group CEO",
    image: image4,
  },
];

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  const [hoveredStat, setHoveredStat] = useState<"years" | "business" | "personnel" | "turnover" | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Light Theme */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-indigo-100">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div
            className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-200 opacity-20 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-200 opacity-30 rounded-full blur-3xl animate-pulse delay-1000"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          ></div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-blue-600 text-sm font-medium rounded-full mb-6 animate-bounce">
              Est. 1991 • Excellence Redefined
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-gray-900 mb-6 leading-tight">
              ABOUT
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-blue-600 animate-pulse">
                DBL GROUP
              </span>

            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Pioneering innovation and excellence since 1991
            </p>
          </div>
        </div>
      </section>


      {/* Story Section */}
      <section className="py-20 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2">
            <div>
              <h2 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-blue-600 mb-6">
                Our Story
              </h2>
              <div className="w-40 h-px bg-blue-600 mb-12"></div>
            </div>
            <div className="space-y-8">
              <p className="text-xl sm:text-2xl font-light text-gray-800 leading-relaxed">
                DBL Group is a family owned business which started in 1991. The first company was named Dulal Brothers Limited.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Over the years, the organization evolved into a diversified conglomerate in Bangladesh. The businesses include Apparel, Textiles, Textile Printing, Washing, Garments Accessories, Packaging, Ceramic Tiles, Pharmaceuticals, Dredging, Retail, and Digital Transformation Services.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                UN Development Program Business Call to Action has recognized our activities to be aligned with UN Sustainable Development Goals. In addition to working with international development organizations such as CARE, DEG, IFC, GIZ, ILO, and UNICEF, DBL has a diverse set of sustainability programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leading the Way Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-blue-600 mb-6">
            LEADING
            <br />
            <span className="text-4xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-blue-600 mb-6">
              THE WAY
            </span>
          </h2>
          <div className="w-32 h-px bg-blue-600 mx-auto mb-12"></div>
          <p className="text-xl sm:text-2xl font-light text-gray-800 max-w-4xl mx-auto leading-relaxed">
            DBL Group redefines industry norms, reaching beyond today's standards to shape a better tomorrow through innovation, sustainability, and excellence.
          </p>
        </div>
      </section>

      {/* Statistics with 3D Effect */}
      <section className="py-20 sm:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-blue-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-blue-600 mb-6">
              Excellence by Numbers
            </h2>
            <div className="w-80 h-px bg-blue-600 mx-auto mb-12"></div>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={12} sm={6} key="years">
              <div
                className="text-center group cursor-pointer transform transition-all duration-500 hover:scale-110"
                onMouseEnter={() => setHoveredStat('years')}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div className={`relative transition-all duration-500 ${hoveredStat === 'years' ? 'transform -translate-y-2' : ''}`}>
                  <div className={`text-5xl sm:text-7xl font-black mb-4 transition-all duration-500 ${hoveredStat === 'years'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 scale-110'
                    : 'text-gray-800'
                    }`}>
                    35
                  </div>
                  <div className="text-sm sm:text-base font-bold text-gray-700 mb-1 uppercase tracking-wide">
                    Years
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Experience
                  </div>
                  <div className={`w-12 h-1 mx-auto mt-4 rounded-full transition-all duration-500 ${hoveredStat === 'years' ? 'w-16 bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-300'
                    }`}></div>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} key="business">
              <div
                className="text-center group cursor-pointer transform transition-all duration-500 hover:scale-110"
                onMouseEnter={() => setHoveredStat('business')}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div className={`relative transition-all duration-500 ${hoveredStat === 'business' ? 'transform -translate-y-2' : ''}`}>
                  <div className={`text-5xl sm:text-7xl font-black mb-4 transition-all duration-500 ${hoveredStat === 'business'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 scale-110'
                    : 'text-gray-800'
                    }`}>
                    24
                  </div>
                  <div className="text-sm sm:text-base font-bold text-gray-700 mb-1 uppercase tracking-wide">
                    Business
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Concerns
                  </div>
                  <div className={`w-12 h-1 mx-auto mt-4 rounded-full transition-all duration-500 ${hoveredStat === 'business' ? 'w-16 bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-300'
                    }`}></div>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} key="personnel">
              <div
                className="text-center group cursor-pointer transform transition-all duration-500 hover:scale-110"
                onMouseEnter={() => setHoveredStat('personnel')}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div className={`relative transition-all duration-500 ${hoveredStat === 'personnel' ? 'transform -translate-y-2' : ''}`}>
                  <div className={`text-5xl sm:text-7xl font-black mb-4 transition-all duration-500 ${hoveredStat === 'personnel'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 scale-110'
                    : 'text-gray-800'
                    }`}>
                    47K
                  </div>
                  <div className="text-sm sm:text-base font-bold text-gray-700 mb-1 uppercase tracking-wide">
                    Dedicated
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Personnel
                  </div>
                  <div className={`w-12 h-1 mx-auto mt-4 rounded-full transition-all duration-500 ${hoveredStat === 'personnel' ? 'w-16 bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-300'
                    }`}></div>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} key="turnover">
              <div
                className="text-center group cursor-pointer transform transition-all duration-500 hover:scale-110"
                onMouseEnter={() => setHoveredStat('turnover')}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div className={`relative transition-all duration-500 ${hoveredStat === 'turnover' ? 'transform -translate-y-2' : ''}`}>
                  <div className={`text-5xl sm:text-7xl font-black mb-4 transition-all duration-500 ${hoveredStat === 'turnover'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-blue-600 scale-110'
                    : 'text-gray-800'
                    }`}>
                    1B
                  </div>
                  <div className="text-sm sm:text-base font-bold text-gray-700 mb-1 uppercase tracking-wide">
                    USD Annual
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Turnover
                  </div>
                  <div className={`w-12 h-1 mx-auto mt-4 rounded-full transition-all duration-500 ${hoveredStat === 'turnover' ? 'w-16 bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-300'
                    }`}></div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Leadership Section - Redesigned with Oversized Frameless Images */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-blue-600 mb-6">
              Our Leadership
            </h2>
            <div className="w-72 h-px bg-blue-600 mx-auto mb-12"></div>
            <p className="text-lg sm:text-xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover the visionaries driving our mission with expertise and innovation.
            </p>
          </div>

          <Row gutter={[24, 24]} className="justify-center">
            {teamMembers.map((member, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-500 group bg-white rounded-xl overflow-hidden h-full flex flex-col transform hover:-translate-y-2">
                  <div className="relative overflow-hidden rounded-t-xl -mx-6 -mt-5">
                    <div className="aspect-[3/4] scale-100">
                      <img
                        alt={member.name}
                        src={member.image}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  <div className="p-6 text-center flex flex-col justify-center flex-grow">
                    <h3 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-blue-600 uppercase tracking-wide mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed mb-3">
                      {member.designation}
                    </p>
                    <div className="w-12 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        @media (max-width: 640px) {
          .text-9xl {
            font-size: 4rem !important;
          }
          .text-8xl {
            font-size: 3rem !important;
          }
          .text-7xl {
            font-size: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default About;