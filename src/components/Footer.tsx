import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Fundi Fasta',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Our Vision', href: '/our-visions' },
        { label: 'Contact', href: '/contact' },
        { label: 'Careers', href: '/careers' },
      ]
    },
    {
      title: 'Learning',
      links: [
        { label: 'Courses', href: '/courses' },
        { label: 'Guides', href: '/guides' },
        { label: 'Resources', href: '/resources' },
        { label: 'Community', href: '/courses' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ]
    },
    {
      title: 'Downloads',
      links: [
        { label: 'Latest Release', href: '/downloads' },
        { label: 'Mobile App', href: '/mobile' },
        { label: 'Resources', href: '/resources' },
      ]
    },
    {
      title: 'Connect',
      links: [
        { label: 'Newsletter', href: '/subscribe' },
        { label: 'Events', href: '/events' },
        { label: 'Blog', href: '/news' },
        { label: 'Partners', href: '/partners' },
      ]
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h5 className="text-white font-semibold mb-3">{section.title}</h5>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm hover:text-orange-400 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="my-8 border-gray-800" />
        
        {/* Brand Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Fundi Fasta</span>
              <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">TZ</span>
            </div>
            <p className="text-sm text-gray-400 hidden md:block">
              Empowering Tanzanian educators to improve learning
            </p>
          </div>
          
          {/* Social Icons - Using simple text links instead of icons */}
          <div className="flex items-center space-x-4">
            <a 
              href="https://www.facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm hover:text-orange-400 transition-colors"
            >
              Facebook
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm hover:text-orange-400 transition-colors"
            >
              Twitter
            </a>
            <a 
              href="https://www.linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm hover:text-orange-400 transition-colors"
            >
              LinkedIn
            </a>
            <a 
              href="https://www.youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm hover:text-orange-400 transition-colors"
            >
              YouTube
            </a>
          </div>
        </div>

        <hr className="my-6 border-gray-800" />
        
        {/* Legal Links */}
        <div className="flex flex-wrap justify-center md:justify-between gap-4 text-xs text-gray-500">
          <div className="flex flex-wrap gap-4">
            <a href="/accessibility" className="hover:text-gray-300 transition-colors">Accessibility Statement</a>
            <a href="/cookies" className="hover:text-gray-300 transition-colors">Cookies Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cookie settings</a>
            <a href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Notice</a>
            <a href="/trademarks" className="hover:text-gray-300 transition-colors">Trademark Policy</a>
          </div>
          <span className="text-gray-500">
            © {currentYear} Fundi Fasta Tanzania. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;