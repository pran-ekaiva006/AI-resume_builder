import { Button } from "client/src/components/ui/button";
import { Input } from "client/src/components/ui/input";
import { Textarea } from "client/src/components/ui/textarea";
import React, { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "client/src/context/ResumeInfoContext";
import { useParams } from "react-router-dom";
import { useApiClient } from "../../../../../service/GlobalApi";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

const emptyForm = {
  universityName: "",
  degree: "",
  major: "",
  startDate: "",
  endDate: "",
  description: "",
};

function Education() {
  const [educationalList, setEducationalList] = useState([emptyForm]);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const { UpdateResumeDetail } = useApiClient();
  const [loading, setLoading] = useState(false);

  // ✅ Load initial education data into local form state **only once**
  useEffect(() => {
    if (resumeInfo?.education?.length > 0) {
      setEducationalList(resumeInfo.education);
    }
  }, [resumeInfo]);

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    const updated = [...educationalList];
    updated[index][name] = value;
    setEducationalList(updated);
  };

  const addEducation = () => {
    setEducationalList([...educationalList, { ...emptyForm }]);
  };

  const removeEducation = () => {
    if (educationalList.length === 1) return;
    setEducationalList((prev) => prev.slice(0, -1));
  };

  const onSave = async () => {
    if (!params.resumeId) return toast.error("Missing resumeId!");

    setLoading(true);
    try {
      const resp = await UpdateResumeDetail(params.resumeId, {
        education: educationalList.map(({ id, ...rest }) => rest),
      });

      // ✅ Update global context ONLY after successful save
      setResumeInfo((prev) => ({
        ...prev,
        education: educationalList,
      }));

      toast.success("✅ Education details saved!");
      console.log("✅ Updated education on backend:", resp);
    } catch (error) {
      toast.error("❌ Failed to save education");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Education</h2>
      <p>Add your educational details</p>

      {educationalList.map((item, index) => (
        <div key={index} className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">

          <div className="col-span-2">
            <label>University Name</label>
            <Input
              name="universityName"
              value={item.universityName}
              onChange={(e) => handleChange(e, index)}
              placeholder="Ex: Stanford University"
            />
          </div>

          <div>
            <label>Degree</label>
            <Input
              name="degree"
              value={item.degree}
              onChange={(e) => handleChange(e, index)}
              placeholder="Ex: Bachelor"
            />
          </div>

          <div>
            <label>Major</label>
            <Input
              name="major"
              value={item.major}
              onChange={(e) => handleChange(e, index)}
              placeholder="Ex: Computer Science"
            />
          </div>

          <div>
            <label>Start Date</label>
            <Input
              type="date"
              name="startDate"
              value={item.startDate?.slice(0, 10) || ""}
              onChange={(e) => handleChange(e, index)}
            />
          </div>

          <div>
            <label>End Date</label>
            <Input
              type="date"
              name="endDate"
              value={item.endDate?.slice(0, 10) || ""}
              onChange={(e) => handleChange(e, index)}
            />
          </div>

          <div className="col-span-2">
            <label>Description</label>
            <Textarea
              name="description"
              value={item.description}
              onChange={(e) => handleChange(e, index)}
              placeholder="Optional: summary about your studies"
            />
          </div>
        </div>
      ))}

      <div className="flex justify-between">
        <Button variant="outline" className="text-primary" onClick={addEducation}>
          + Add More Education
        </Button>

        <Button variant="outline" className="text-primary" onClick={removeEducation}>
          - Remove
        </Button>

        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Education;
