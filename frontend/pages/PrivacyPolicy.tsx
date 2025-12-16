import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Privacy Policy</h1>

                <div className="prose prose-slate max-w-none">
                    <p className="mb-6 text-slate-600">
                        At Doltec (“Company”, “Platform”, “we”, “our”, “us”), your privacy is our priority. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website (www.doltec.in) and services.
                    </p>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li><strong>For Candidates:</strong> Name, contact details, resume, qualifications, work experience, and application history.</li>
                            <li><strong>For Employers:</strong> Business name, contact information, job postings, and billing details.</li>
                            <li><strong>Automatically Collected Data:</strong> IP address, browser type, device details, and usage patterns via cookies, analytics tools, and log files.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li>To facilitate recruitment between candidates and employers.</li>
                            <li>To personalize and enhance the platform experience.</li>
                            <li>To send important updates, security alerts, and promotional offers.</li>
                            <li>To improve website performance, security, and features.</li>
                            <li>To comply with legal and regulatory obligations.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">3. Sharing of Information</h2>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li>Candidate data is shared only with employers where the candidate has applied.</li>
                            <li>Employer information is disclosed only as necessary for recruitment activities.</li>
                            <li>Third-party service providers (e.g., payment processors, hosting services) may access limited data as required to deliver services.</li>
                            <li>Doltec does not sell, rent, or trade personal information to unauthorized third parties.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">4. Cookies & Tracking Technologies</h2>
                        <p className="text-slate-600">
                            Doltec uses cookies, pixels, and similar tracking technologies to improve website performance, remember user preferences, and deliver relevant content. Users may disable cookies in their browser settings, but certain features may not function properly.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">5. Data Security</h2>
                        <p className="text-slate-600">
                            We use industry-standard encryption, firewalls, and secure servers to protect your personal data. However, no digital system is 100% secure, and Doltec cannot guarantee absolute security. Users are encouraged to protect their own accounts with strong passwords.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">6. Data Retention</h2>
                        <p className="text-slate-600">
                            We retain candidate and employer data as long as accounts remain active or as required to comply with legal obligations. Inactive accounts may have their data archived or deleted after a reasonable period.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">7. User Rights</h2>
                        <p className="text-slate-600">
                            Users have the right to access, update, correct, or request deletion of their personal data. Requests can be made at <a href="mailto:support@doltec.in" className="text-brand-600 hover:underline">support@doltec.in</a>.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">8. Third-Party Services</h2>
                        <p className="text-slate-600">
                            Doltec may integrate with trusted third-party vendors such as payment gateways, analytics providers, or hosting services. These providers operate under their own privacy policies and Doltec is not responsible for their practices.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">9. International Users</h2>
                        <p className="text-slate-600">
                            If you access Doltec from outside India, your data may be transferred, stored, and processed in India. By using our platform, you consent to such transfers in compliance with applicable data laws.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">10. Children’s Privacy</h2>
                        <p className="text-slate-600">
                            Doltec is not intended for individuals under 18 years of age. We do not knowingly collect personal data from minors. If we become aware that a minor has submitted data, it will be deleted promptly.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">11. Changes to Privacy Policy</h2>
                        <p className="text-slate-600">
                            Doltec reserves the right to update this policy at any time. Significant changes will be communicated via email or platform notifications. Continued use of Doltec constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">12. Contact & Grievance Officer</h2>
                        <p className="text-slate-600 mb-2">For privacy-related concerns or complaints, please contact our Grievance Officer:</p>
                        <p className="text-slate-600">
                            <strong>Email:</strong> <a href="mailto:support@doltec.in" className="text-brand-600 hover:underline">support@doltec.in</a><br />
                            <strong>Address:</strong> Doltec Pvt. Ltd., Bangalore, India
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
