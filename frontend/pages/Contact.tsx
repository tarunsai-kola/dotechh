import React, { useState } from 'react';
import { Mail, Phone, Send } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        email: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formData);
        alert('Message sent successfully!');
        setFormData({ fullName: '', contactNumber: '', email: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center py-20 px-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Get in Touch with Us</h1>
                    <p className="text-slate-400">
                        Have questions or need AI solutions? Let us know by filling out the form, and we'll be in touch!
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {/* Email Card */}
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-900/30 text-blue-400 rounded-lg flex items-center justify-center">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-1">E-mail</p>
                            <p className="font-semibold text-lg">support@doltec.in</p>
                        </div>
                    </div>

                    {/* Phone Card */}
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-900/30 text-blue-400 rounded-lg flex items-center justify-center">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Phone</p>
                            <p className="font-semibold text-lg">+91-8310626647</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="tel"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            placeholder="Contact Number"
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Id"
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Write your message here..."
                            rows={5}
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                            required
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-4 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-lg shadow-blue-900/20"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
