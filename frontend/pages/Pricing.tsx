import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, Shield, Zap, Users } from 'lucide-react';

const Pricing = () => {
    const plans = [
        {
            duration: '1 Month',
            price: '₹2,499',
            total: '₹2,948.82',
            features: [
                'Unlimited job postings',
                'Full access to candidate database',
                'Complete hiring workflow',
                'Shortlist and reject candidates',
                'Schedule interviews',
                'Upload offer letters'
            ],
            highlight: false
        },
        {
            duration: '3 Months',
            price: '₹6,499',
            total: '₹7,668.82',
            features: [
                'Unlimited job postings',
                'Full access to candidate database',
                'Complete hiring workflow',
                'Shortlist and reject candidates',
                'Schedule interviews',
                'Upload offer letters'
            ],
            highlight: true
        },
        {
            duration: '6 Months',
            price: '₹11,890',
            total: '₹14,030.20',
            features: [
                'All features of shorter plans',
                '24/7 priority support',
                'Unlimited job postings',
                'Full access to candidate database',
                'Complete hiring workflow',
                'Shortlist and reject candidates'
            ],
            highlight: false
        },
        {
            duration: '1 Year',
            price: '₹21,890',
            total: '₹25,830.20',
            features: [
                'All features of shorter plans',
                'Dedicated account manager',
                '24/7 priority support',
                'Unlimited job postings',
                'Full access to candidate database',
                'Complete hiring workflow'
            ],
            highlight: false
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Hero Section */}
            <section className="bg-slate-900 text-white py-20 text-center px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Flexible Plans for Your <span className="text-brand-400">Hiring Needs</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Each plan lets you post jobs, manage candidates, conduct interviews, and share offer letters directly from your dashboard.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="max-w-7xl mx-auto px-6 -mt-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`
                bg-white rounded-2xl shadow-xl overflow-hidden border-2 flex flex-col
                ${plan.highlight ? 'border-brand-500 transform md:-translate-y-4' : 'border-transparent'}
              `}
                        >
                            {plan.highlight && (
                                <div className="bg-brand-500 text-white text-center py-1 text-sm font-bold uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}
                            <div className="p-8 flex-grow">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.duration}</h3>
                                <div className="mb-1">
                                    <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                                    <span className="text-slate-500 text-sm"> + GST</span>
                                </div>
                                <p className="text-slate-500 text-sm mb-6">Total: {plan.total}</p>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                                            <Check size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-8 pt-0 mt-auto">
                                <Link
                                    to="/login"
                                    className={`
                    block w-full py-3 px-6 rounded-lg text-center font-semibold transition-colors
                    ${plan.highlight
                                            ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-200'
                                            : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}
                  `}
                                >
                                    Subscribe
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-5xl mx-auto px-6 mt-24">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Get Started With Your Hiring Workflow</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                            Select a plan and start posting jobs, managing candidates, conducting interviews, and sharing offer letters from the dashboard.
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-lg"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Pricing;
