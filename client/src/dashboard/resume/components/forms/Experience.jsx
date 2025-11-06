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

const formField = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  workSummery: "",
};

function Experience() {
  const [experinceList, setExperinceList] = useState([]);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const { UpdateResumeDetail } = useApiClient();

  // ✅ Load from resumeInfo only once
  useEffect(() => {
    if (resumeInfo?.experience?.length > 0) {
      setExperinceList(resumeInfo.experience);
    }
  }, [resumeInfo]);

  const handleChange = (index, event) => {
    const newEntries = [...experinceList];
    newEntries[index][event.target.name] = event.target.value;
    setExperinceList(newEntries);
  };

  const AddNewExperience = () => {
    setExperinceList([...experinceList, { ...formField }]);
  };

  const RemoveExperience = () => {
    setExperinceList((prev) => prev.slice(0, -1));
  };

  const handleRichTextEditor = (value, name, index) => {
    const newEntries = [...experinceList];
    newEntries[index][name] = value;
    setExperinceList(newEntries);
  };

  // ✅ Fix infinite re-render (important)
  useEffect(() => {
    if (resumeInfo?.experience !== experinceList) {
      setResumeInfo((prev) => ({
        ...prev,
        experience: experinceList,
      }));
    }
  }, [experinceList]);

  // ✅ AI Bullet Points Generation
  const GenerateAIforExperience = async (index) => {
    const jobTitle = experinceList[index]?.title;
    if (!jobTitle) return toast.error("Enter the Position Title first!");

    setLoading(true);
    try {
      const prompt = `Generate 6 resume bullet points for the role "${jobTitle}". Use strong action verbs and quantifiable achievements. Return only <ul><li> HTML.`;

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/generate`,
        { prompt, format: "html" },
        { withCredentials: true }
      );

      const newEntries = [...experinceList];
      newEntries[index].workSummery = response.data.content;
      setExperinceList(newEntries);

      toast.success("✅ AI Work Summary Generated!");
    } catch (error) {
      toast.error("❌ Failed to generate from AI");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save Experience to DB
  const onSave = async () => {
    setLoading(true);

    try {
      await UpdateResumeDetail(params.resumeId, {
        experience: experinceList.map(({ id, ...rest }) => rest),
      });

      toast.success("✅ Experience details updated!");
    } catch (error) {
      toast.error("❌ Failed to update experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Professional Experience</h2>
      <p>Add work experience details</p>

      {experinceList.map((item, index) => (
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

          {/* ✅ FIX DATE FORMAT */}
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
            onClick={() => GenerateAIforExperience(index)}
            className="text-primary border-primary"
            variant="outline"
            disabled={loading}
          >
            ✨ Generate from AI
          </Button>

          <RichTextEditor
            defaultValue={item.workSummery || ""}
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
