import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { toast } from 'sonner';

function PersonalDetail({ enabledNext }) {
  const { resumeId } = useParams(); // ✅ Get resume ID from URL
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resumeInfo) setFormData(resumeInfo);
  }, [resumeInfo]);

  const handleInputChange = (e) => {
    enabledNext(false);
    const { name, value } = e.target;

    const updated = {
      ...formData,
      [name]: value,
    };
    setFormData(updated);
    setResumeInfo(updated);
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    console.log('resumeId:', resumeId);
    console.log('Data being sent:', formData);
  
    // Add this check here:
    if (!resumeId) {
      toast.error('Resume ID is missing, cannot update');
      setLoading(false);
      return;
    }
  
    try {
      const response = await GlobalApi.UpdateResumeDetail(resumeId, formData);
      console.log('✅ Resume updated:', response);
      toast.success('Details updated');
      enabledNext(true);
    } catch (error) {
      console.error('❌ Error updating resume:', error);
      toast.error('Failed to update');
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
            <label className='text-sm'>First Name</label>
            <Input
              name='firstName'
              value={formData.firstName || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className='text-sm'>Last Name</label>
            <Input
              name='lastName'
              value={formData.lastName || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='col-span-2'>
            <label className='text-sm'>Job Title</label>
            <Input
              name='jobTitle'
              value={formData.jobTitle || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='col-span-2'>
            <label className='text-sm'>Address</label>
            <Input
              name='address'
              value={formData.address || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className='text-sm'>Phone</label>
            <Input
              name='phone'
              value={formData.phone || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className='text-sm'>Email</label>
            <Input
              name='email'
              value={formData.email || ''}
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
