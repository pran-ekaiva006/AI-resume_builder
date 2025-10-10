import { Input } from 'client/src/components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { Button } from 'client/src/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { ResumeInfoContext } from 'client/src/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import { useApiClient } from '../../../../../service/GlobalApi'; // ✅ updated import
import { toast } from 'sonner';

function Skills() {
  const [skillsList, setSkillsList] = useState([
    { name: '', rating: 0 },
  ]);
  const { resumeId } = useParams();
  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  // ✅ Get secured API function
  const { UpdateResumeDetail } = useApiClient();

  useEffect(() => {
    if (resumeInfo?.skills?.length > 0) {
      setSkillsList(resumeInfo.skills);
    }
  }, [resumeInfo]);

  const handleChange = (index, name, value) => {
    const updated = [...skillsList];
    updated[index][name] = value;
    setSkillsList(updated);
  };

  const AddNewSkills = () => {
    setSkillsList([...skillsList, { name: '', rating: 0 }]);
  };

  const RemoveSkills = () => {
    setSkillsList((prev) => prev.slice(0, -1));
  };

  const onSave = async () => {
    if (!resumeId) {
      toast.error('❌ Missing resumeId. Please try again.');
      return;
    }

    setLoading(true);
    const data = {
      skills: skillsList.map(({ id, ...rest }) => rest),
    };

    try {
      const resp = await UpdateResumeDetail(resumeId, data);
      console.log('✅ Skills updated:', resp);
      toast.success('Skills updated successfully!');
    } catch (error) {
      console.error('❌ Error updating skills:', error);
      toast.error('Server Error — please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      skills: skillsList,
    });
  }, [skillsList, setResumeInfo]);

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Add your top professional key skills</p>

      <div>
        {skillsList.map((item, index) => (
          <div
            key={index}
            className="flex justify-between mb-2 border rounded-lg p-3"
          >
            <div>
              <label className="text-xs">Name</label>
              <Input
                className="w-full"
                value={item.name || ''}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />
            </div>
            <Rating
              style={{ maxWidth: 120 }}
              value={item.rating}
              onChange={(v) => handleChange(index, 'rating', v)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={AddNewSkills}
            className="text-primary"
          >
            + Add More Skill
          </Button>
          <Button
            variant="outline"
            onClick={RemoveSkills}
            className="text-primary"
          >
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  );
}

export default Skills;
