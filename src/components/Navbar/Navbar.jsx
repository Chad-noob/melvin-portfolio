import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuLine1 = useRef(null);
  const menuLine2 = useRef(null);
  const menuLine3 = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = () => {
    gsap.to(menuLine1.current, { width: "100%", duration: 0.3, ease: "power2.out" });
    gsap.to(menuLine3.current, { width: "100%", duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(menuLine1.current, { width: "50%", duration: 0.3, ease: "power2.out" });
    gsap.to(menuLine3.current, { width: "50%", duration: 0.3, ease: "power2.out" });
  };
  

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-gray-800">MG</div>
        
        {/* Full Menu - visible when not scrolled */}
        <ul className={`flex gap-8 text-gray-800 transition-opacity duration-300 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <li>
            <a href="#about" className="hover:text-gray-600 transition-colors">
              About
            </a>
          </li>
          <li>
            <a href="#work" className="hover:text-gray-600 transition-colors">
              Work
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-gray-600 transition-colors">
              Contact
            </a>
          </li>
        </ul>
      </div>

      {/* Hamburger Menu - fixed in top right corner when scrolled */}
      <div 
        className={`fixed top-6 right-6 cursor-pointer transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="flex flex-col gap-[6px] w-[30px]">
          <div 
            ref={menuLine1}
            className="h-[2px] bg-gray-800 transition-all duration-300"
            style={{ width: '50%' }}
          />
          <div 
            ref={menuLine2}
            className="h-[2px] bg-gray-800 w-full"
          />
          <div 
            ref={menuLine3}
            className="h-[2px] bg-gray-800 transition-all duration-300 ml-auto"
            style={{ width: '50%' }}
          />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && isScrolled && (
        <div className="fixed top-20 right-6 bg-white shadow-lg rounded-lg p-6 min-w-[200px]">
          <ul className="flex flex-col gap-4 text-gray-800">
            <li>
              <a href="#about" className="hover:text-gray-600 transition-colors block">
                About
              </a>
            </li>
            <li>
              <a href="#work" className="hover:text-gray-600 transition-colors block">
                Work
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-gray-600 transition-colors block">
                Contact
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
