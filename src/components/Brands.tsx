"use client";

// Generate brand data from the 26 images in the directory
const brands = Array.from({ length: 26 }, (_, i) => ({
  name: `Brand Partner ${i + 1}`,
  image: `/images/Brands We Worked With/${i + 1}.jpg`,
  alt: `Brand partner ${i + 1} logo - Quantalyze client`,
}));

const ROW_SIZE = Math.ceil(brands.length / 2);
const REPEAT = 4;
const topRow = Array(REPEAT).fill(brands.slice(0, Math.ceil(brands.length / 2))).flat();
const bottomRow = Array(REPEAT).fill(brands.slice(Math.ceil(brands.length / 2))).flat();

export default function Brands() {
  return (
    <section id="brands" className="py-20 bg-yellow-50 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-base text-yellow-600 font-semibold tracking-widest uppercase mb-3 font-sans">
            Trusted By Industry Leaders
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 font-sans">
            Brands We&apos;ve Worked With
          </h3>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-sans">
            Join the ranks of successful companies that have partnered with Quantalyze to achieve their digital goals.
          </p>
        </div>
        {/* Two smooth marquees */}
        <div className="space-y-12 mb-12">
          {/* Top Row */}
          <div className="relative w-full overflow-hidden py-2">
            <div className="flex flex-nowrap w-max animate-marquee-l gap-20">
              {topRow.map((brand, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center rounded-2xl shadow-xl bg-yellow-100/80 transition-all duration-300 h-48 w-64 mx-2 group"
                >
                  <img
                    src={brand.image}
                    alt={brand.alt}
                    className="max-h-36 w-auto object-contain transition-all duration-300 group-hover:scale-125 group-hover:shadow-2xl"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Bottom Row */}
          <div className="relative w-full overflow-hidden py-2">
            <div className="flex flex-nowrap w-max animate-marquee-r gap-20">
              {bottomRow.map((brand, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center rounded-2xl shadow-xl bg-yellow-100/80 transition-all duration-300 h-48 w-64 mx-2 group"
                >
                  <img
                    src={brand.image}
                    alt={brand.alt}
                    className="max-h-36 w-auto object-contain transition-all duration-300 group-hover:scale-125 group-hover:shadow-2xl"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Stats (unchanged) */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-yellow-600 mb-2">
              200+
            </div>
            <div className="text-lg text-gray-700 font-medium">
              Happy Clients
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-yellow-600 mb-2">
              25+
            </div>
            <div className="text-lg text-gray-700 font-medium">
              Cities Served Across India
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-yellow-600 mb-2">
              100%
            </div>
            <div className="text-lg text-gray-700 font-medium">
              Client-Satisfaction Oriented
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
