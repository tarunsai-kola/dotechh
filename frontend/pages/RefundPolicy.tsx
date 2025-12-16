import React from 'react';

const RefundPolicy = () => {
    return (
        <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Refund & Cancellation Policy</h1>

                <div className="prose prose-slate max-w-none">
                    <p className="mb-6 text-slate-600">
                        At Doltec, we are committed to delivering a seamless recruitment experience. This Refund & Cancellation Policy defines our practices regarding payments made on our platform.
                    </p>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">1. Cancellation of Services</h2>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li>No cancellations are permitted once a service (job posting, premium feature, or subscription) has been purchased or activated.</li>
                            <li>Employers and candidates are therefore advised to carefully review services before making a payment.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">2. Refund Eligibility</h2>
                        <p className="text-slate-600 mb-2">Refunds will only be considered under the following circumstances:</p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li>Duplicate payment due to a technical error.</li>
                            <li>Payment deducted but service not activated due to system failure.</li>
                            <li>No refunds shall be processed for change of mind, dissatisfaction with service usage, or after a job posting/service has been utilized.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">3. Refund Processing Timeline</h2>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li>Verified and approved refund requests will be processed within 15–30 working days from the date of approval.</li>
                            <li>The time taken to reflect in your account depends on your bank/payment gateway policies, and Doltec will not be liable for any delays on their end.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">4. Mode of Refund</h2>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li>All refunds will be credited back to the original payment method used during the transaction.</li>
                            <li>No cash or alternative mode of refund will be entertained.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">5. Refund Request Procedure</h2>
                        <p className="text-slate-600 mb-2">To initiate a refund request, users must email <a href="mailto:support@doltec.in" className="text-brand-600 hover:underline">support@doltec.in</a> with the following details:</p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li>Transaction ID</li>
                            <li>Date of Payment</li>
                            <li>Registered Email ID and Contact Number</li>
                            <li>Proof of deduction (e.g., payment screenshot/statement)</li>
                        </ul>
                        <p className="mt-4 text-slate-600">
                            Doltec reserves the right to verify all refund claims and reject those that do not meet the above criteria.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
