import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} For Ocean Foundation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
