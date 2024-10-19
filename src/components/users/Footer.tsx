import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white py-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold mb-4">About Us</h3>
                        <p className="text-sm">
                            We are dedicated to connecting book lovers with the
                            best reads, whether you're looking to rent. Start
                            your book-sharing journey with us today!
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="hover:underline">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold mb-4">
                            Follow Us
                        </h3>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer">
                                <FaFacebook className="text-2xl hover:text-blue-600" />
                            </a>
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer">
                                <FaInstagram className="text-2xl hover:text-pink-600" />
                            </a>
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer">
                                <FaLinkedin className="text-2xl hover:text-blue-700" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-10 pt-4 text-center">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Book.D.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
