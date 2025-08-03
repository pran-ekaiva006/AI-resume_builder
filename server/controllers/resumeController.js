

exports.createResume = async (req, res) => {
  try {
    const resume = new NewResume(req.body);
    const savedResume = await resume.save();
    res.status(201).json(savedResume); 
    
    
    console.log("Saved resume:", savedResume);
// ✅ Return the saved document directly
  } catch (err) {
    console.error("Error creating resume:", err.message);
    res.status(400).json({ error: err.message });
  }
};



exports.getAllResumes = async (req, res) => {
  try {
    const resumes = await NewResume.find();
    res.status(200).json({
      message: "Resumes fetched successfully",
      resumes,
    });
  } catch (err) {
    console.error("Error fetching resumes:", err.message);
    res.status(500).json({ error: err.message });
  }
};
