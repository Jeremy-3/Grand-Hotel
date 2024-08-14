import React from 'react';
import { FaHome, FaPhoneAlt, FaInfoCircle, FaSignInAlt } from 'react-icons/fa';

const About = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '50px' }}>
      {/* Logo Section */}
      <div style={{ marginBottom: '20px' }}>
        <img
          src="https://static.vecteezy.com/system/resources/previews/013/087/536/original/illustration-logo-grand-hotel-boutique-vintage-design-free-vector.jpg"
          alt="Grand Hotel Logo"
          style={{ height: '80px' }}
        />

      </div>
      <div>
        {/* Navigation Section */}
      <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center', gap: '30px', fontSize: '20px' }}>
        <div>
          <FaHome />
          <span style={{ marginLeft: '5px' }}>HOME</span>
        </div>
        <div>
          <FaPhoneAlt />
          <span style={{ marginLeft: '5px' }}>CONTACTS</span>
        </div>
        <div>
          <FaInfoCircle />
          <span style={{ marginLeft: '5px' }}>ABOUT</span>
        </div>
        <div>
          <FaSignInAlt />
          <span style={{ marginLeft: '5px' }}>LOGIN</span>
        </div>
      </div>

      </div>

      {/* Title Section */}
      <h1 style={{ fontSize: '72px', fontWeight: 'bold', margin: '0', fontFamily: '"Comic Sans MS", cursive' }}>
        GRAND HOTEL
      </h1>


      {/* Description Section */}
      <p style={{ fontSize: '24px', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto' }}>
        Grand Hotel is a modern Web-flow template for Hotels & Resorts. It uses the CMS to manage your rooms & events.
        It highlights beautiful photos of your Hotel with great typography.
      </p>
    </div>
  );
};

export default About;
