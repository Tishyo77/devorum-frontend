import React, { useState, useEffect } from 'react';
import './EditProfileModal.css';
import api from '../api';

const EditProfileModal = ({ isOpen, onClose, onSave, userData = {}, userCerts = {}}) => {
  const roles = [
    'Student', 'Professional', 'Freelancer', 'Entrepreneur', 'Academic', 'Hobbyist',
  ];

  const qualifications = [
    'High School Diploma', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree',
    'Doctorate (PhD)', 'Diploma/Certification', 'Vocational Training', 'Professional Certification',
    'Technical Certification', 'MBA (Master of Business Administration)', 'MD (Doctor of Medicine)',
    'JD (Juris Doctor)', 'Postdoctoral Studies', 'Online Course Certification', 'Bootcamp Graduate',
  ];

  const allSkills = [
    'Python', 'Java', 'C++', 'JavaScript', 'Ruby', 'PHP', 'Go', 'Swift', 'Kotlin', 'R', 'HTML', 'CSS',
    'React.js', 'Angular', 'Vue.js', 'Node.js', 'ASP.NET', 'Swift', 'Objective-C', 'Flutter', 'Unity',
    'Unreal Engine', 'C#', 'SQL', 'NoSQL', 'PostgreSQL', 'MySQL', 'Firebase', 'RESTful APIs',
    'GraphQL', 'Selenium', 'JUnit', 'Appium', 'Cypress', 'Jenkins', 'Git', 'Docker', 'Kubernetes',
    'CI/CD pipelines', 'Ansible', 'Terraform', 'AWS', 'Microsoft Azure', 'Google Cloud Platform',
    'GitHub', 'GitLab', 'Bitbucket', 'Pandas', 'NumPy', 'Excel', 'Tableau', 'Power BI', 'Matplotlib',
    'Seaborn', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Keras', 'CNNs', 'RNNs', 'Transformers',
    'spaCy', 'NLTK', 'Hadoop', 'Spark', 'Hive', 'Pig', 'Apache Airflow', 'ETL pipelines',
    'Snowflake', 'Databricks', 'R', 'SAS', 'MATLAB', 'Stata', 'Looker', 'QlikView', 'Cognos',
    'Firewalls', 'IDS/IPS', 'VPNs', 'Penetration testing', 'Metasploit', 'Burp Suite', 'Kali Linux',
    'SSL/TLS', 'PKI', 'AES', 'RSA', 'Okta', 'Active Directory', 'LDAP', 'SIEM tools', 'Wireshark',
    'Nessus', 'Cisco routers', 'Juniper switches', 'Windows Server', 'Linux Server', 'Apache',
    'Nginx', 'VMware', 'Hyper-V', 'VirtualBox', 'Veeam', 'Acronis', 'PowerShell', 'Bash Scripting',
    'Chef', 'Puppet', 'AutoCAD', 'SolidWorks', 'CATIA', 'Fusion 360', 'MakerBot', 'Ultimaker',
    'Formlabs', 'PCB design', 'KiCAD', 'Eagle', 'Altium Designer', 'Arduino', 'Raspberry Pi',
    'ESP32', 'ROS', 'Gazebo', 'Simulink', 'MQTT', 'CoAP', 'ThingSpeak', 'Photoshop', 'Illustrator',
    'CorelDRAW', 'Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'Blender', 'Maya', '3ds Max',
    'Figma', 'Sketch', 'Adobe XD', 'Axure', 'After Effects', 'Cinema 4D', 'Jira', 'Trello',
    'Monday.com', 'Asana', 'SAP', 'Oracle ERP', 'NetSuite', 'Salesforce', 'HubSpot', 'Zoho',
    'Solidity', 'Ethereum', 'Hyperledger', 'Smart contracts', 'Reinforcement learning', 'Generative AI',
    'Qiskit', 'Cirq', 'Quantum Development Kit', 'Oculus SDK', 'Unity VR', 'Vuforia',
  ];

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    qualification: '',
  });

  const [certifications, setCertifications] = useState(userCerts); 
  const [newCert, setNewCert] = useState({ title: '', link: '' });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState(allSkills);
  const [searchTerm, setSearchTerm] = useState('');

  // Reset formData and skills when modal opens or userData changes
  useEffect(() => {
    if (isOpen && userData) {
      setFormData({
        name: userData[0]?.name || '',
        role: userData[0]?.roles || '',
        qualification: userData[0]?.qualification || '',
      });

      const userSkills = (userData[0]?.skills || '').split(',').filter(Boolean);
      setSelectedSkills(userSkills);
      setAvailableSkills(allSkills.filter(skill => !userSkills.includes(skill)));

      setCertifications(userCerts);
    }
  }, [isOpen, userData]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const updatedSkills = selectedSkills.join(',');
    const email = localStorage.getItem('email');
    const updatedCerts = certifications.map(({ certification_id, title, link }) => ({
      certification_id,
      title,
      link,
    }));
    await updateProfile({ ...formData, skills: updatedSkills, certifications: updatedCerts });
    
    onSave(); 
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateProfile = async (data) => {
    try {
      const email = localStorage.getItem('email'); 
      await api.put('/user/', {
        email,
        update: {
          name: data.name,
          roles: data.role,
          qualification: data.qualification,
          skills: data.skills,
        },
      });

      const certificationPromises = data.certifications.map(cert =>
        api.put('/certification/', {
          certification_id: cert.certification_id,
          newTitle: cert.title,
          newLink: cert.link,
          user_id: userData[0].user_id,
        })
      );
  
      await Promise.all(certificationPromises);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating your profile.');
    }
  };

  const handleAddCert = async () => {
    try {
      const userId = userData.user_id;
      const response = await api.post('/certification/', { title: '', link: '', user_id: userId });
      setCertifications((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Error adding certification:', error);
      alert('Could not add a new certification.');
    }
  };

  const handleRemoveCert = async () => {
    try {
      if (certifications.length === 0) {
        alert('No certifications to remove.');
        return;
      }

      const certToRemove = certifications[certifications.length - 1];
      await api.delete('/certification/', {
        data: { certification_id: certToRemove.certification_id },
      });

      setCertifications((prev) => prev.slice(0, -1));
    } catch (error) {
      console.error('Error removing certification:', error);
      alert('Could not remove the last certification.');
    }
  };

  const handleCertChange = (certId, field, value) => {
    setCertifications((prev) =>
      prev.map((cert) =>
        cert.certification_id === certId ? { ...cert, [field]: value } : cert
      )
    );
  };

  const filteredSkills = searchTerm
    ? availableSkills.filter((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="modal-overlay">
      <div className="edit-modal">
        <h2>Edit Profile</h2>
        <form>
        <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
            >
              <option value="" disabled>Select a role</option>
              {roles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="qualification">Qualification:</label>
            <select
              id="qualification"
              value={formData.qualification}
              onChange={(e) => handleChange('qualification', e.target.value)}
            >
              <option value="" disabled>Select a qualification</option>
              {qualifications.map((qualification, index) => (
                <option key={index} value={qualification}>
                  {qualification}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="skills">Skills:</label>
            <div className="selected-skills">
              {selectedSkills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                  <button
                    type="button"
                    className="remove-skill-button"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="add-skill">
              <input
                type="text"
                placeholder="Search for a skill"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <div className="skill-suggestions">
                  {filteredSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="skill-suggestion"
                      onClick={() => handleAddSkill(skill)}
                    >
                      {skill}
                    </div>
                  ))}
                  {filteredSkills.length === 0 && (
                    <div className="no-suggestions">No matching skills found</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="certifications">Certifications:</label>
            <div className="certification-list">
              {certifications.map((cert, index) => (
                <div key={cert.certification_id} className="certification-item">
                  <input
                    type="text"
                    value={cert.title}
                    onChange={(e) => handleCertChange(cert.certification_id, 'title', e.target.value)}
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={cert.link}
                    onChange={(e) => handleCertChange(cert.certification_id, 'link', e.target.value)}
                    placeholder="Link"
                  />
                </div>
              ))}
              <div className="certification-actions">
                <button type="button" onClick={handleAddCert}>Add Certification</button>
                {certifications.length > 0 && (
                  <button type="button" onClick={handleRemoveCert}>Remove Last Certification</button>
                )}
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="save-button" onClick={handleSave}>
              Save
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
