'use client';

import Link from 'next/link';
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Press', href: '/press' },
  ],
  properties: [
    { label: 'Buy Property', href: '/search?listingType=buy' },
    { label: 'Rent Property', href: '/search?listingType=rent' },
    { label: 'New Projects', href: '/search?possession=under-construction' },
    { label: 'Commercial', href: '/search?propertyType=commercial' },
    { label: 'PG/Hostel', href: '/search?propertyType=pg' },
  ],
  services: [
    { label: 'Post Property', href: '/add-property' },
    { label: 'Property Valuation', href: '/valuation' },
    { label: 'Legal Services', href: '/legal' },
    { label: 'Home Loans', href: '/home-loans' },
    { label: 'Vastu', href: '/vastu' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Sitemap', href: '/sitemap' },
    { label: 'Feedback', href: '/feedback' },
  ],
};

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
];

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-dark-card to-dark-bg text-gray-300 border-t border-neon-blue/20">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl opacity-30" />

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 group">
            <Link href="/" className="flex items-center gap-2 mb-6 hover:scale-105 transition-transform">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple group-hover:shadow-lg group-hover:shadow-neon-blue/50 transition-all duration-300">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white group-hover:text-neon-cyan transition-colors">Riyal Estate</span>
                <p className="text-xs text-gray-400 group-hover:text-neon-blue/50 transition-colors">Premium Property Platform</p>
              </div>
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors">
              Discover your dream property with Riyal Estate. Premium properties for sale and rent across India. Verified listings, transparent pricing, and seamless transactions.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm group/item hover:translate-x-2 transition-transform">
                <Phone className="h-4 w-4 text-neon-blue group-hover/item:text-neon-cyan" />
                <span className="text-gray-400 group-hover/item:text-neon-blue transition-colors">+91 1800-123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm group/item hover:translate-x-2 transition-transform">
                <Mail className="h-4 w-4 text-neon-purple group-hover/item:text-neon-cyan" />
                <span className="text-gray-400 group-hover/item:text-neon-blue transition-colors">support@riyalestate.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm group/item hover:translate-x-2 transition-transform">
                <MapPin className="h-4 w-4 text-neon-pink group-hover/item:text-neon-cyan" />
                <span className="text-gray-400 group-hover/item:text-neon-blue transition-colors">Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="group">
            <h4 className="text-white font-semibold mb-6 text-lg group-hover:text-neon-blue transition-colors">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-neon-blue hover:translate-x-1 transition-all duration-300 inline-flex items-center"
                  >
                    <span className="w-1 h-1 bg-neon-blue rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="group">
            <h4 className="text-white font-semibold mb-6 text-lg group-hover:text-neon-blue transition-colors">Properties</h4>
            <ul className="space-y-3">
              {footerLinks.properties.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-neon-blue hover:translate-x-1 transition-all duration-300 inline-flex items-center"
                  >
                    <span className="w-1 h-1 bg-neon-blue rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="group">
            <h4 className="text-white font-semibold mb-6 text-lg group-hover:text-neon-purple transition-colors">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-neon-purple hover:translate-x-1 transition-all duration-300 inline-flex items-center"
                  >
                    <span className="w-1 h-1 bg-neon-purple rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="group">
            <h4 className="text-white font-semibold mb-6 text-lg group-hover:text-neon-pink transition-colors">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-neon-pink hover:translate-x-1 transition-all duration-300 inline-flex items-center"
                  >
                    <span className="w-1 h-1 bg-neon-pink rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cities */}
        <div className="mt-14 pt-10 border-t border-neon-blue/20">
          <h4 className="text-white font-semibold mb-6 text-lg">Popular Cities</h4>
          <div className="flex flex-wrap gap-3">
            {cities.map((city, idx) => (
              <Link
                key={city}
                href={`/search?city=${city}`}
                className="px-4 py-2 text-sm bg-dark-hover border border-neon-blue/20 rounded-full text-gray-300 hover:bg-gradient-to-r hover:from-neon-blue/20 hover:to-neon-purple/20 hover:text-neon-blue hover:border-neon-blue/50 transition-all duration-300 transform hover:scale-105"
                style={{ transitionDelay: `${idx * 30}ms` }}
              >
                📍 {city}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neon-blue/20">
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} <span className="text-neon-blue font-semibold">Riyal Estate</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-neon-blue hover:scale-110 transition-all duration-300" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-blue hover:scale-110 transition-all duration-300" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-purple hover:scale-110 transition-all duration-300" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-purple hover:scale-110 transition-all duration-300" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-pink hover:scale-110 transition-all duration-300" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}