
'use strict';

const request = require('supertest');
const app = require('./testApp');
const User = require('../models/User');

/**
 * Verify that POST /api/resumes creates a genuinely blank resume
 * — no hardcoded fake career data, only identity fields populated.
 */
describe('Resume creation starts blank (no fake content)', () => {
  let cookies;

  beforeEach(async () => {
    // Sign up a fresh user
    const res = await request(app)
      .post('/api/auth/signup')
      .set('X-Forwarded-For', '10.20.30.40')
      .send({
        firstName: 'Blank',
        lastName: 'Tester',
        email: 'blank-tester@example.com',
        password: 'SecurePass123!',
      });

    expect(res.status).toBe(201);

    const setCookie = res.headers['set-cookie'];
    cookies = setCookie.map(c => c.split(';')[0]).join('; ');
  });

  it('should create a resume with empty jobTitle, experience, education, and skills', async () => {
    const createRes = await request(app)
      .post('/api/resumes')
      .set('Cookie', cookies)
      .send({
        title: 'My Blank Resume',
        themeColor: '#C9A227',
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);

    const resume = createRes.body.resume;

    // Identity fields should be populated
    expect(resume.title).toBe('My Blank Resume');
    expect(resume.themeColor).toBe('#C9A227');
    expect(resume.userEmail).toBe('blank-tester@example.com');

    // Content fields must be empty — no hardcoded fake data
    expect(resume.jobTitle).toBeUndefined();
    expect(resume.phone).toBeUndefined();
    expect(resume.address).toBeUndefined();
    expect(resume.summery).toBeUndefined();
    expect(resume.experience).toEqual([]);
    expect(resume.education).toEqual([]);
    expect(resume.skills).toEqual([]);
  });

  it('should show 0% completion for a blank resume (no populated sections)', async () => {
    const createRes = await request(app)
      .post('/api/resumes')
      .set('Cookie', cookies)
      .send({ title: 'Another Blank Resume', themeColor: '#C9A227' });

    if (createRes.status !== 201) {
      console.log('Error 401 body:', createRes.body);
    }
    expect(createRes.status).toBe(201);

    const resume = createRes.body.resume;

    // Compute the same heuristic the dashboard uses
    const hasSummary = Boolean(resume.summery?.trim());
    const hasExperience = Array.isArray(resume.experience) && resume.experience.length > 0;
    const hasEducation = Array.isArray(resume.education) && resume.education.length > 0;
    const hasSkills = Array.isArray(resume.skills) && resume.skills.length > 0;

    const score = [hasSummary, hasExperience, hasEducation, hasSkills].filter(Boolean).length;
    const percentage = Math.round((score / 4) * 100);

    expect(percentage).toBe(0);
  });
});
