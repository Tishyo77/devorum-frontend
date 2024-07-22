import React, { useState } from 'react';
import './SignUpPage.css';

const roles = [
  'Student', 'Professional', 'Freelancer', 'Entrepreneur', 'Academic', 'Hobbyist'
];

const qualifications = [
  'High School Diploma', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree',
  'Doctorate (PhD)', 'Diploma/Certification', 'Vocational Training', 'Professional Certification',
  'Technical Certification', 'MBA (Master of Business Administration)', 'MD (Doctor of Medicine)',
  'JD (Juris Doctor)', 'Postdoctoral Studies', 'Online Course Certification', 'Bootcamp Graduate'
];

const allSkills = [
  'JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'Python', 'Java', 'C++',
  'SQL', 'NoSQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'Agile', 'Scrum',
  'DevOps', 'Machine Learning', 'Data Science', 'UI/UX Design'
];

const SignUpPart2 = ({ nextPart, skipPart }) => {
  const [formData, setFormData] = useState({
    role: '',
    qualification: '',
    skills: ''
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [certifications, setCertifications] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'skills') {
      if (value) {
        const filteredSkills = allSkills.filter(skill =>
          skill.toLowerCase().includes(value.toLowerCase()) &&
          !selectedSkills.includes(skill)
        );
        setSuggestions(filteredSkills);
      } else {
        setSuggestions([]);
      }
    }
  };

  const handleSkillClick = (skill) => {
    setSelectedSkills([...selectedSkills, skill]);
    setFormData({ ...formData, skills: '' });
    setSuggestions([]);
  };

  const handleDeleteSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const addCertification = () => {
    setCertifications([...certifications, { name: '', link: '' }]);
  };

  const removeCertification = () => {
    if (certifications.length > 0) {
      const updatedCertifications = [...certifications];
      updatedCertifications.pop();
      setCertifications(updatedCertifications);
    }
  };

  const handleCertificationChange = (index, field, value) => {
    const newCertifications = [...certifications];
    newCertifications[index][field] = value;
    setCertifications(newCertifications);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextPart();
  };

  return (
    <div className="signup-part">
      <p>Let your potential collaborators know why you are amazing!</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="" disabled>Select your role</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Qualification:</label>
          <select name="qualification" value={formData.qualification} onChange={handleChange} required>
            <option value="" disabled>Select your qualification</option>
            {qualifications.map((qualification, index) => (
              <option key={index} value={qualification}>{qualification}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Skills:</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Start typing to search for skills"
          />
          <div className="suggestions">
            {suggestions.map((skill, index) => (
              <div
                key={index}
                className="suggestion"
                onClick={() => handleSkillClick(skill)}
              >
                {skill}
              </div>
            ))}
          </div>
          <div className="selected-skills">
            {selectedSkills.map((skill, index) => (
              <div key={index} className="selected-skill">
                {skill}
                <button type="button" onClick={() => handleDeleteSkill(skill)}>x</button>
              </div>
            ))}
          </div>
        </div>
        {certifications.map((certification, index) => (
          <div key={index} className="form-group certification-group">
            <label>Certification {index + 1} Name:</label>
            <input
              type="text"
              value={certification.name}
              onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
              required
            />
            <label>Certification {index + 1} Link:</label>
            <input
              type="text"
              value={certification.link}
              onChange={(e) => handleCertificationChange(index, 'link', e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" className="add-certification" onClick={addCertification}>+ Add Certification</button>
        {certifications.length > 0 && (
          <button type="button" className="remove-certification" onClick={removeCertification}>- Remove Certification</button>
        )}
        <button type="submit">Next</button>
        <button type="button" onClick={skipPart}>Skip</button>
      </form>
    </div>
  );
};

export default SignUpPart2;
