import React from 'react';

const Footer = () => {
  return (
    <footer className="relative mt-16 bg-white/40 backdrop-blur-md border-t border-white/30 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-gray-700">
        
        {/* Brand Info - Logo and Text in one line */}
        <div className="flex items-center space-x-3 mb-4">
          <img src="/FundLogo.png" alt="FundPay Logo" className="w-12 h-12" />
          <div>
            <h2 className="text-xl font-bold text-indigo-800">FundPay</h2>
            <p className="text-sm text-gray-600">
              Connecting dreamers with supporters to make a meaningful impact.
            </p>
          </div>
        </div>

        {/* Optional central text if needed */}
        <div className="text-center text-gray-600 text-sm">
          &nbsp;
        </div>
      </div>

      {/* Bottom-right single line */}
      <div className="absolute bottom-2 right-4 text-gray-600 text-lg">
        Made in India | Made with ❤️
      </div>

      <div className="mt-6 text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} FundPay. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
