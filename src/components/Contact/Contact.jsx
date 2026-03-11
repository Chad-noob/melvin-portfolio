import { useRef, useState, useCallback } from 'react';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('');

    try {
      await emailjs.sendForm(
        'service_u620o6e',
        'template_6zi5pgn',
        formRef.current,
        'Xd5Ot5JpPbqHZE9k9'
      );
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(''), 5000);
    } catch (error) {
      setStatus('error');
      console.error('Email send error:', error);
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center px-8 py-20"
      style={{ willChange: 'auto' }}
    >
      <div className="max-w-4xl w-full">
        {/* Main heading */}
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-20 leading-tight">
          Let's start a<br />project together
        </h2>

        {/* Contact form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-16">
          {/* Question 01 - Name */}
          <div className="border-b border-gray-700 pb-6">
            <label className="flex items-start gap-8">
              <span className="text-sm text-gray-500 mt-2">01</span>
              <div className="flex-1">
                <div className="text-lg mb-4">What's your name?</div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe *"
                  required
                  autoComplete="name"
                  className="w-full bg-transparent text-gray-400 text-2xl md:text-3xl outline-none placeholder-gray-600 focus:placeholder-gray-500"
                />
              </div>
            </label>
          </div>

          {/* Question 02 - Email */}
          <div className="border-b border-gray-700 pb-6">
            <label className="flex items-start gap-8">
              <span className="text-sm text-gray-500 mt-2">02</span>
              <div className="flex-1">
                <div className="text-lg mb-4">What's your email?</div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@doe.com *"
                  required
                  autoComplete="email"
                  className="w-full bg-transparent text-gray-400 text-2xl md:text-3xl outline-none placeholder-gray-600 focus:placeholder-gray-500"
                />
              </div>
            </label>
          </div>

          {/* Question 03 - Message */}
          <div className="border-b border-gray-700 pb-6">
            <label className="flex items-start gap-8">
              <span className="text-sm text-gray-500 mt-2">03</span>
              <div className="flex-1">
                <div className="text-lg mb-4">What's your message?</div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Hello, I'd like to work with you... *"
                  required
                  rows="4"
                  className="w-full bg-transparent text-gray-400 text-2xl md:text-3xl outline-none placeholder-gray-600 focus:placeholder-gray-500 resize-none"
                />
              </div>
            </label>
          </div>

          {/* Submit button */}
          <div className="flex justify-end pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative px-12 py-4 bg-white text-black font-medium text-lg rounded-full overflow-hidden transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </span>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Status messages */}
          {status === 'success' && (
            <div className="success-message text-green-400 text-center py-4">
              ✓ Message sent successfully! I'll get back to you soon.
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-red-400 text-center py-4">
              ✗ Something went wrong. Please try again or email me directly.
            </div>
          )}
        </form>

        {/* Footer info */}
        <div className="mt-20 pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500">
          <div>melvingeorge1804@gmail.com</div>
          <div className="flex gap-6">
            <a href="https://github.com/Chad-noob" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="#linkedin" className="hover:text-white transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
