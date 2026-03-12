import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuLine1 = useRef(null);
  const menuLine2 = useRef(null);
  const menuLine3 = useRef(null);
  const toggleTimeout = useRef(null);

  const toggleMenu = () => {
    // Prevent rapid clicking
    if (toggleTimeout.current) return;
    
    setIsMenuOpen(prev => !prev);
    
    toggleTimeout.current = setTimeout(() => {
      toggleTimeout.current = null;
    }, 300);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

    };


    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open - simplified for Lenis
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleMouseEnter = () => {
    if (!isMenuOpen) {
      gsap.to(menuLine1.current, { width: "100%", duration: 0.3, ease: "power2.out", overwrite: true });
      gsap.to(menuLine3.current, { width: "100%", duration: 0.3, ease: "power2.out", overwrite: true });
    }
  };

  const handleMouseLeave = () => {
    if (!isMenuOpen) {
      gsap.to(menuLine1.current, { width: "50%", duration: 0.3, ease: "power2.out", overwrite: true });
      gsap.to(menuLine3.current, { width: "50%", duration: 0.3, ease: "power2.out", overwrite: true });
    }
  };
  

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-lg sm:text-xl font-bold text-gray-800">MG</div>
        
        {/* Full Menu - visible when not scrolled */}
        <ul className={`hidden md:flex gap-6 lg:gap-8 text-sm lg:text-base text-gray-800 transition-opacity duration-300 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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
            <a href="https://www.linkedin.com/in/melvin-george-889b25286/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">
              LinkedIn
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-gray-600 transition-colors">
              Contact
            </a>
          </li>
        </ul>
      </div>

      {/* Hamburger Menu - always visible on mobile screens, visible when scrolled on desktop*/}
      <div 
        className={`fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 cursor-pointer z-[60] transition-opacity duration-300 
          ${isScrolled ? 'md:opacity-100' : 'md:opacity-0 md:pointer-events-none'} 
          md:hidden ${isScrolled ? 'md:!block' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={toggleMenu}
      >
        <div className="flex flex-col gap-[5px] sm:gap-[6px] w-[25px] sm:w-[30px]">
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
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] animate-fadeIn"
            onClick={toggleMenu}
          />
          
          {/* Menu */}
          <div className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded-xl p-5 sm:p-6 min-w-[180px] sm:min-w-[200px] z-[60] animate-slideDown">
            <ul className="flex flex-col gap-3 sm:gap-4 text-gray-800 text-sm sm:text-base">
              <li>
                <a href="#about" className="hover:text-gray-600 transition-colors block py-1" onClick={toggleMenu}>
                  About
                </a>
              </li>
              <li>
                <a href="#work" className="hover:text-gray-600 transition-colors block py-1" onClick={toggleMenu}>
                  Work
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/melvin-george-889b25286/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors block py-1" onClick={toggleMenu}>
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-gray-600 transition-colors block py-1" onClick={toggleMenu}>
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </>
      )}
    </nav>
  );
}
