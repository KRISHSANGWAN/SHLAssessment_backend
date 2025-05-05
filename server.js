const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const assessments = [
  { id: 1, name: "Coding Assessment - Java", role: "Software Engineer", skills: ["Java", "OOPs", "DSA"], weights: [2, 1, 1], duration: 45 },
  { id: 2, name: "Leadership Survey", role: "Team Lead", skills: ["Leadership", "Decision Making"], weights: [2, 1], duration: 30 },
  { id: 3, name: "Communication Skills Test", role: "Customer Support", skills: ["Communication", "Listening"], weights: [2, 1], duration: 20 },
  { id: 4, name: "Full Stack Developer Test", role: "Frontend Developer", skills: ["JavaScript", "React", "CSS"], weights: [1, 2, 1], duration: 60 },
  { id: 5, name: "Data Analyst Challenge", role: "Data Analyst", skills: ["SQL", "Python", "Statistics"], weights: [1, 2, 1], duration: 50 }
];

app.get("/recommend", (req, res) => {
  const { role = "", skills = "", jobDescription = "" } = req.query;
  const skillList = skills ? skills.split(',').map(s => s.trim()) : [];

  if (!role && skillList.length === 0) {
    return res.status(400).json({ message: "Role or skills must be provided." });
  }

  const recs = assessments
    .filter(a => a.role === role || a.skills.some(s => skillList.includes(s)))
    .map(a => {
      let score = 0, total = 0;
      a.skills.forEach((s, i) => {
        total += a.weights[i];
        if (skillList.includes(s)) score += a.weights[i];
      });
      return { ...a, matchScore: Math.round((score / total) * 100) };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);

  if (recs.length === 0) {
    return res.status(404).json({ message: "No recommendations found for the given criteria." });
  }

  res.json({ recommendations: recs });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
