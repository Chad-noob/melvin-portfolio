export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-gray-800">MG</div>
        <ul className="flex gap-8 text-gray-800">
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
    </nav>
  );
}
