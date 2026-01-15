import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#181C14] text-[#D4AF37] py-16 px-6">
      <div className="mx-auto max-w-7xl grid gap-12 md:grid-cols-3">
        {/* About Section */}
        <div className="md:ml-6 ml-1">
          <h3 className="mb-4 font-serif text-2xl">FineTaste Restaurant</h3>
          <p className="text-sm text-[#D4AF37]/80">
            Crafting exquisite dining experiences with flavors that delight and
            an ambiance that inspires.
          </p>
        </div>

        {/* Contact Info */}
        <div className="md:ml-0 ml-1">
          <h4 className="mb-4 font-medium text-lg">Contact Us</h4>
          <p className="text-sm text-[#D4AF37]/80">
            123 Luxury Ave, Gourmet City
          </p>
          <p className="text-sm text-[#D4AF37]/80">Phone: +1 (555) 123-4567</p>
          <p className="text-sm text-[#D4AF37]/80">Email: info@finetaste.com</p>
        </div>

        {/* Social Media / Links */}
        <div>
          <h4 className="mb-4 font-medium text-lg">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" className="transition hover:text-white">
              Instagram
            </a>
            <a href="#" className="transition hover:text-white">
              Facebook
            </a>
            <a href="#" className="transition hover:text-white">
              Twitter
            </a>
          </div>
          <p className="mt-6 text-sm text-[#D4AF37]/70">
            © {new Date().getFullYear()} FineTaste Restaurant. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
