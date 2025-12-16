const axios = require('axios'); // Assuming axios is installed or we use fetch. Node 18+ has fetch.
// Using fetch for compatibility if axios missing, but axios is easier.
// Let's assume fetch is available (Node 22).

const BASE_URL = 'http://localhost:5000/api';

async function runTest() {
    console.log('Starting Verification Flow...');

    const companyEmail = `company_${Date.now()}@test.com`;
    const studentEmail = `student_${Date.now()}@test.com`;
    const password = 'password123';
    let companyToken, companyId, jobId, studentToken, studentId, profileId, applicationId;

    try {
        // 1. Register Company
        console.log(`\n1. Registering Company (${companyEmail})...`);
        const regCompRes = await fetch(`${BASE_URL}/auth/register-company`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: companyEmail,
                password,
                companyName: 'Test Corp',
                phone: '1234567890'
            })
        });
        const regCompData = await regCompRes.json();
        if (regCompData.status !== 'success') throw new Error(`Company Reg Failed: ${regCompData.message}`);
        companyToken = regCompData.token;
        // Need to get companyId. It might not be in response directly depending on implementation.
        // Let's check if user has companyId or we need to fetch profile.
        // The register-company route usually returns user and token.
        // If user.companyId is present, good.
        // If not, we might need to fetch /api/companies/me or similar?
        // Let's assume for now we can get it or we might need to login again?
        // Actually, let's look at the register-company implementation if needed.
        // Assuming user object has it or we can find it.
        // Wait, the register-company controller creates a Company and updates User with companyId.
        // So user.companyId should be there.
        companyId = regCompData.user.companyId;
        console.log(`   -> Company Registered. ID: ${companyId}`);

        // 2. Update Company Profile
        console.log(`\n2. Updating Company Profile...`);
        const updateCompRes = await fetch(`${BASE_URL}/companies/${companyId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${companyToken}`
            },
            body: JSON.stringify({
                description: 'We test things.',
                website: 'https://test.com',
                locations: ['Test City']
            })
        });
        const updateCompData = await updateCompRes.json();
        if (updateCompData.status !== 'success') throw new Error(`Company Update Failed: ${updateCompData.message}`);
        console.log(`   -> Company Profile Updated.`);

        // 3. Create Job
        console.log(`\n3. Creating Job...`);
        const createJobRes = await fetch(`${BASE_URL}/companies/${companyId}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${companyToken}`
            },
            body: JSON.stringify({
                title: 'Test Engineer',
                description: 'Test the platform thoroughly.',
                skills: ['Testing', 'Node.js'],
                experienceMin: 1,
                experienceMax: 3,
                salaryRange: { min: 50000, max: 80000 },
                location: 'Remote',
                employmentType: 'Full-time',
                status: 'published'
            })
        });
        const createJobData = await createJobRes.json();
        if (createJobData.status !== 'success') {
            const fs = require('fs');
            fs.writeFileSync('job_error.json', JSON.stringify(createJobData, null, 2));
            throw new Error(`Job Create Failed: ${createJobData.message}`);
        }
        jobId = createJobData.data._id;
        console.log(`   -> Job Created. ID: ${jobId}`);

        // 4. Register Student
        console.log(`\n4. Registering Student (${studentEmail})...`);
        const regStudRes = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: studentEmail,
                password,
                role: 'student'
            })
        });
        const regStudData = await regStudRes.json();
        if (regStudData.status !== 'success') throw new Error(`Student Reg Failed: ${regStudData.message}`);
        studentToken = regStudData.token;
        studentId = regStudData.user.id;
        console.log(`   -> Student Registered. ID: ${studentId}`);

        // 5. Create Student Profile
        console.log(`\n5. Creating Student Profile...`);
        const createProfRes = await fetch(`${BASE_URL}/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`
            },
            body: JSON.stringify({
                displayName: 'Test Student',
                headline: 'Aspiring Tester',
                skills: [{ name: 'Testing', level: 'Intermediate', years: 1 }],
                resumeUrl: 'http://example.com/resume.pdf'
            })
        });
        const createProfData = await createProfRes.json();
        if (createProfData.status !== 'success') throw new Error(`Profile Create Failed: ${createProfData.message}`);
        profileId = createProfData.profile._id;
        console.log(`   -> Student Profile Created. ID: ${profileId}`);

        // 6. Search Job
        console.log(`\n6. Searching for Job...`);
        const searchRes = await fetch(`${BASE_URL}/jobs?q=Test Engineer`);
        const searchData = await searchRes.json();
        if (searchData.status !== 'success' || searchData.data.length === 0) throw new Error(`Job Search Failed`);
        console.log(`   -> Job Found.`);

        // 7. Apply for Job
        console.log(`\n7. Applying for Job...`);
        const applyRes = await fetch(`${BASE_URL}/jobs/${jobId}/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`
            },
            body: JSON.stringify({
                coverNote: 'I want to test this.'
            })
        });
        const applyData = await applyRes.json();
        if (applyData.status !== 'success') throw new Error(`Application Failed: ${applyData.message}`);
        applicationId = applyData.data._id;
        console.log(`   -> Applied. Application ID: ${applicationId}`);

        // 8. Verify Duplicate Apply Fails
        console.log(`\n8. Verifying Duplicate Application Rejection...`);
        const dupApplyRes = await fetch(`${BASE_URL}/jobs/${jobId}/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`
            },
            body: JSON.stringify({ coverNote: 'Again' })
        });
        const dupApplyData = await dupApplyRes.json();
        if (dupApplyData.status !== 'error') throw new Error(`Duplicate Application Should Fail`);
        console.log(`   -> Duplicate Application Rejected (Expected).`);

        // 9. Company List Applications
        console.log(`\n9. Company Listing Applications...`);
        const listAppRes = await fetch(`${BASE_URL}/companies/${companyId}/jobs/${jobId}/applications`, {
            headers: { 'Authorization': `Bearer ${companyToken}` }
        });
        const listAppData = await listAppRes.json();
        if (listAppData.status !== 'success' || listAppData.data.length === 0) throw new Error(`List Applications Failed`);
        console.log(`   -> Application Listed.`);

        // 10. Update Status
        console.log(`\n10. Updating Application Status...`);
        const updateStatusRes = await fetch(`${BASE_URL}/applications/${applicationId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${companyToken}`
            },
            body: JSON.stringify({ status: 'seen' })
        });
        const updateStatusData = await updateStatusRes.json();
        if (updateStatusData.status !== 'success') throw new Error(`Status Update Failed: ${updateStatusData.message}`);
        console.log(`   -> Status Updated to 'seen'.`);

        console.log('\n--------------------------------------------------');
        console.log('ALL VERIFICATION TESTS PASSED SUCCESSFULLY');
        console.log('--------------------------------------------------');

    } catch (error) {
        const fs = require('fs');
        fs.writeFileSync('error.json', JSON.stringify({ message: error.message, stack: error.stack }, null, 2));
        console.error('VERIFICATION FAILED. See error.json');
        process.exit(1);
    }
}

runTest();
