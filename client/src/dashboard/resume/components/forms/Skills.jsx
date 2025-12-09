import { Input } from 'client/src/components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { Button } from 'client/src/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { ResumeInfoContext } from 'client/src/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import { useApiClient } from '../../../../../service/GlobalApi';
import { toast } from 'sonner';

function Skills() {
  const [skillsList, setSkillsList] = useState([{ name: '', rating: 0 }]);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { UpdateResumeDetail } = useApiClient();
  const { resumeId } = useParams();
  const [loading, setLoading] = useState(false);

  // ✅ Load initial skills - convert percentage to stars for display
  useEffect(() => {
    if (resumeInfo?.skills?.length > 0) {
      const convertedSkills = resumeInfo.skills.map((skill) => ({
        ...skill,
        rating: skill.rating / 20, // Convert 0-100 to 0-5 for star display
      }));
      setSkillsList(convertedSkills);
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
    if (skillsList.length === 1) return;
    setSkillsList((prev) => prev.slice(0, -1));
  };

  const onSave = async () => {
    if (!resumeId) {
      toast.error('❌ Missing resumeId. Please try again.');
      return;
    }

    setLoading(true);
    try {
      // ✅ Convert star rating (0-5) to percentage (0-100) before saving
      const skillsToSave = skillsList.map(({ id, rating, ...rest }) => ({
        ...rest,
        rating: Math.round(rating * 20), // Convert 0-5 stars to 0-100%
      }));

      const resp = await UpdateResumeDetail(resumeId, {
        skills: skillsToSave,
      });

      // ✅ Update context with percentage values
      setResumeInfo((prev) => ({
        ...prev,
        skills: skillsToSave,
      }));

      console.log('✅ Skills updated:', resp);
      toast.success('✅ Skills updated successfully!');
    } catch (error) {
      console.error('❌ Error updating skills:', error);
      toast.error('Server error — please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Add your top professional skills</p>

      {skillsList.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between mb-3 border rounded-lg p-3 gap-3"
        >
          <Input
            className="flex-1"
            placeholder="Skill Name"
            value={item.name}
            onChange={(e) => handleChange(index, 'name', e.target.value)}
          />

          <div className="flex items-center gap-2">
            <Rating
              style={{ maxWidth: 120 }}
              value={item.rating} // 0-5 scale for stars
              onChange={(v) => handleChange(index, 'rating', v)}
            />
            <span className="text-xs text-gray-500 w-12 text-right">
              {Math.round(item.rating * 20)}%
            </span>
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={AddNewSkills} className="text-primary">
            + Add More Skill
          </Button>
          <Button variant="outline" onClick={RemoveSkills} className="text-primary">
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
