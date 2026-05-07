import React from 'react'
import { Menu, X, ChevronDown, Instagram, Facebook, Twitter, Youtube, ArrowRight, Dumbbell, Droplet, Apple, Pill, Calendar, Activity, Heart, Zap, Trophy, Users, Star, Clock, Smartphone, Phone, Mail, MapPin, Lock } from 'lucide-react'

function Footer() {
  return (
    <>
    <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">FitTrack</h3>
              <p className="text-gray-400">Your all-in-one fitness companion for a healthier lifestyle.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition duration-300">Features</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition duration-300">About</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition duration-300">Testimonials</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition duration-300">Pricing</a></li>
                <li><a href="#blog" className="text-gray-400 hover:text-white transition duration-300">Blog</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition duration-300">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <Facebook className="w-6 h-6" />
                </a> 
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <Youtube className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} FitTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
    </>
  )
}

export default Footer
