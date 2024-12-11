import React, { useState } from 'react';
import './SignUpPage.css';
import api from '../api';

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
  'Python', 'Java', 'C++', 'JavaScript', 'Ruby', 'PHP', 'Go', 'Swift', 'Kotlin', 'R', 'HTML', 'CSS', 'React.js', 'Angular', 'Vue.js', 'Node.js', 'ASP.NET', 'Swift', 'Objective-C', 'Flutter', 'Unity', 'Unreal Engine', 'C#', 'SQL', 'NoSQL', 'PostgreSQL', 'MySQL', 'Firebase', 'RESTful APIs', 'GraphQL', 'Selenium', 'JUnit', 'Appium', 'Cypress', 'Jenkins', 'Git', 'Docker', 'Kubernetes', 'CI/CD pipelines', 'Ansible', 'Terraform', 'AWS', 'Microsoft Azure', 'Google Cloud Platform', 'GitHub', 'GitLab', 'Bitbucket', 'Pandas', 'NumPy', 'Excel', 'Tableau', 'Power BI', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Keras', 'CNNs', 'RNNs', 'Transformers', 'spaCy', 'NLTK', 'Hadoop', 'Spark', 'Hive', 'Pig', 'Apache Airflow', 'ETL pipelines', 'Snowflake', 'Databricks', 'R', 'SAS', 'MATLAB', 'Stata', 'Looker', 'QlikView', 'Cognos', 'Firewalls', 'IDS/IPS', 'VPNs', 'Penetration testing', 'Metasploit', 'Burp Suite', 'Kali Linux', 'SSL/TLS', 'PKI', 'AES', 'RSA', 'Okta', 'Active Directory', 'LDAP', 'SIEM tools', 'Wireshark', 'Nessus', 'Cisco routers', 'Juniper switches', 'Windows Server', 'Linux Server', 'Apache', 'Nginx', 'VMware', 'Hyper-V', 'VirtualBox', 'Veeam', 'Acronis', 'PowerShell', 'Bash Scripting', 'Chef', 'Puppet', 'AutoCAD', 'SolidWorks', 'CATIA', 'Fusion 360', 'MakerBot', 'Ultimaker', 'Formlabs', 'PCB design', 'KiCAD', 'Eagle', 'Altium Designer', 'Arduino', 'Raspberry Pi', 'ESP32', 'ROS', 'Gazebo', 'Simulink', 'MQTT', 'CoAP', 'ThingSpeak', 'Photoshop', 'Illustrator', 'CorelDRAW', 'Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'Blender', 'Maya', '3ds Max', 'Figma', 'Sketch', 'Adobe XD', 'Axure', 'After Effects', 'Cinema 4D', 'Jira', 'Trello', 'Monday.com', 'Asana', 'SAP', 'Oracle ERP', 'NetSuite', 'Salesforce', 'HubSpot', 'Zoho', 'Solidity', 'Ethereum', 'Hyperledger', 'Smart contracts', 'Reinforcement learning', 'Generative AI', 'Qiskit', 'Cirq', 'Quantum Development Kit', 'Oculus SDK', 'Unity VR', 'Vuforia'
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const storedEmail = localStorage.getItem('signUpEmail');
      
      // Step 1: Update user details
      await api.put('/user', {
        email: storedEmail,
        update: {
          roles: formData.role,
          qualification: formData.qualification,
          skills: selectedSkills.join(','),
        },
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userIdResponse = await api.post('/user/email', { email: storedEmail }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userId = userIdResponse.data[0].user_id;

      console.log(userId);

      for (const cert of certifications) {
        await api.post('/certification', {
          title: cert.name,
          link: cert.link,
          user_id: userId,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      nextPart();
    } catch (error) {
      console.error('An error occurred while updating user details:', error);
    }
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
