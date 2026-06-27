import { Button } from 'client/src/components/ui/button';
import { Input } from 'client/src/components/ui/input';
import { ResumeInfoContext } from 'client/src/context/ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApiClient } from '../../../../../service/GlobalApi'; // ✅ updated import
import { toast } from 'sonner';

function PersonalDetail({ enabledNext }) {
  const { resumeId } = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const { CreateNewResume, UpdateResumeDetail } = useApiClient(); // ✅ Clerk-secured API client

  useEffect(() => {
    if (resumeInfo) setFormData(resumeInfo);
  }, [resumeInfo]);

  const handleInputChange = (e) => {
    enabledNext(false);
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    setResumeInfo(updated);
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ Create a specific payload with only personal detail fields
    const updateData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      jobTitle: formData.jobTitle,
      address: formData.address,
      phone: formData.phone,
      userEmail: formData.userEmail,
    };

    try {
      let finalResumeId = resumeId;

      // If resumeId is missing, create a new resume
      if (!resumeId || resumeId === 'undefined') {
        const createResponse = await CreateNewResume(formData); // Create can use full formData
        finalResumeId = createResponse?.resume?.resumeId;

        if (!finalResumeId) {
          toast.error('❌ Failed to create new resume');
          setLoading(false);
          return;
        }

        setResumeInfo({ ...formData, resumeId: finalResumeId });
        toast.success('🆕 Resume created');
      }

      // Update existing resume with the specific payload
      const response = await UpdateResumeDetail(finalResumeId, updateData);

      toast.success('Details updated ✅');
      enabledNext(true);
    } catch (error) {
      console.error('❌ Error saving resume:', error);
      toast.error('Failed to save resume ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Personal Detail</h2>
      <p>Get Started with the basic information</p>

      <form onSubmit={onSave}>
        <div className='grid grid-cols-2 mt-5 gap-3'>
          <div>
            <label htmlFor="firstName" className='text-sm'>First Name</label>
            <Input
              id="firstName"
              name='firstName'
              value={formData.firstName || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className='text-sm'>Last Name</label>
            <Input
              id="lastName"
              name='lastName'
              value={formData.lastName || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='col-span-2'>
            <label htmlFor="jobTitle" className='text-sm'>Job Title</label>
            <Input
              id="jobTitle"
              name='jobTitle'
              value={formData.jobTitle || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='col-span-2'>
            <label htmlFor="address" className='text-sm'>Address</label>
            <Input
              id="address"
              name='address'
              value={formData.address || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className='text-sm'>Phone</label>
            <Input
              id="phone"
              name='phone'
              value={formData.phone || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="userEmail" className='text-sm'>Email</label>
            <Input
              id="userEmail"
              name='userEmail'
              value={formData.userEmail || ''}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className='mt-3 flex justify-end'>
          <Button type='submit' disabled={loading}>
            {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalDetail;
