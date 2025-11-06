import { Button } from "client/src/components/ui/button";
import { Input } from "client/src/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import RichTextEditor from "../RichTextEditor";
import { ResumeInfoContext } from "client/src/context/ResumeInfoContext";
import { useParams } from "react-router-dom";
import { useApiClient } from "../../../../../service/GlobalApi";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import axios from "axios";

const EMPTY_EXPERIENCE = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  workSummery: "",
};

function Experience() {
  const [experienceList, setExperienceList] = useState([]);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const { UpdateResumeDetail } = useApiClient();
  const [loading, setLoading] = useState(false);

  /** ✅ Load initial data */
  useEffect(() => {
    if (Array.isArray(resumeInfo?.experience)) {
      setExperienceList(resumeInfo.experience);
    }
  }, [resumeInfo]);

  /** ✅ Update ctx only when list changes */
  useEffect(() => {
    setResumeInfo((prev) => ({ ...prev, experience: experienceList }));
  }, [experienceList]);

  const handleChange = (index, event) => {
    const updated = [...experienceList];
    updated[index][event.target.name] = event.target.value;
    setExperienceList(updated);
  };

  const handleRichTextEditor = (value, name, index) => {
    const updated = [...experienceList];
    updated[index][name] = value;
    setExperienceList(updated);
  };

  const AddNewExperience = () => {
    setExperienceList([...experienceList, { ...EMPTY_EXPERIENCE }]);
  };

  const RemoveExperience = () => {
    if (experienceList.length > 1) {
      setExperienceList((prev) => prev.slice(0, -1));
    }
  };

  /** ✅ AI Bullet Generation */
  const GenerateAIforExperience = async (index) => {
    const jobTitle = experienceList[index]?.title;
    if (!jobTitle) return toast.error("⚠️ Enter Job Title before generating.");

    setLoading(true);
    try {
      const prompt = `Generate 6 resume bullet points for the role "${jobTitle}". Use strong verbs & measurable achievements. Return only <ul><li> HTML.`;

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/generate`,
        { prompt, format: "html" },
        { withCredentials: true }
      );

      const updated = [...experienceList];
      updated[index].workSummery = response.data.content;
      setExperienceList(updated);

      toast.success("✨ AI Work Summary Generated!");
    } catch (error) {
      toast.error("❌ Failed to generate summary from AI");
    } finally {
      setLoading(false);
    }
  };

  /** ✅ Save to database */
  const onSave = async () => {
    if (!params.resumeId) return toast.error("Resume ID missing ❌");

    setLoading(true);
    try {
      await UpdateResumeDetail(params.resumeId, {
        experience: experienceList.map(({ id, ...rest }) => rest),
      });

      toast.success("✅ Experience saved successfully!");
    } catch (error) {
      toast.error("❌ Failed to save Experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Professional Experience</h2>
      <p>Add your relevant work experience.</p>

      {experienceList.map((item, index) => (
        <div key={index} className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">

          <Input
            name="title"
            value={item.title}
            onChange={(e) => handleChange(index, e)}
            placeholder="Job Title"
          />

          <Input
            name="companyName"
            value={item.companyName}
            onChange={(e) => handleChange(index, e)}
            placeholder="Company Name"
          />

          <Input
            name="city"
            value={item.city}
            onChange={(e) => handleChange(index, e)}
            placeholder="City"
          />

          <Input
            name="state"
            value={item.state}
            onChange={(e) => handleChange(index, e)}
            placeholder="State"
          />

          {/* ✅ Fix HTML date format */}
          <Input
            type="date"
            name="startDate"
            value={item.startDate?.slice(0, 10) || ""}
            onChange={(e) => handleChange(index, e)}
          />

          <Input
            type="date"
            name="endDate"
            value={item.endDate?.slice(0, 10) || ""}
            onChange={(e) => handleChange(index, e)}
          />

          <Button
            variant="outline"
            className="text-primary border-primary"
            onClick={() => GenerateAIforExperience(index)}
            disabled={loading}
          >
            {loading ? <LoaderCircle className="animate-spin" /> : "✨ Generate from AI"}
          </Button>

          <RichTextEditor
            defaultValue={item.workSummery}
            onRichTextEditorChange={(value) =>
              handleRichTextEditor(value, "workSummery", index)
            }
          />
        </div>
      ))}

      <div className="flex justify-between">
        <Button variant="outline" onClick={AddNewExperience} className="text-primary">
          + Add More Experience
        </Button>
        <Button variant="outline" onClick={RemoveExperience} className="text-primary">
          - Remove
        </Button>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Experience;
