import React from 'react';
import './About.css';

const About = () => {
  const sectionStyle = {
    backgroundImage: 'url("https://www.furoregrandhotel.com/wp-content/uploads/2023/11/DSC04194-HDR_1918x1084.jpg")',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '50px',
    textAlign: 'center',
    fontSize: '36px',
  };

  const titleStyle = {
    fontSize: '72px',
    fontWeight: 'bold',
    margin: '0',
    fontFamily: '"Comic Sans MS", cursive',
  };

  return (
    <div id='About'>

    <div className="about">
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Title Section */}
      <div style={sectionStyle}>
        <h1 style={{...titleStyle, color: 'white'}}>GRAND HOTEL</h1>
      </div>

      {/* Sections */}
      <section style={{
        ...sectionStyle,
        backgroundImage: 'url("https://cf.bstatic.com/xdata/images/hotel/max1024x768/519796706.jpg?k=3f81c14baa8cf83048749f73f16f21e25c1d070894ca7dfe272953f4e7b9b3e2&o=&hp=1")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        color: 'white',
        textShadow: '2px 2px 4px black',
      }}>
        <h2>Welcome to Grand Hotel</h2>
        <p>
          Nestled in the heart of Mexico, Grands Hotel offers a unique blend of modern luxury and timeless elegance.
          Our hotel is more than just a place to stay—it's a destination that brings the vibrant spirit of Mexico-City to life.
          Whether you’re here for business, leisure, or a special occasion, we provide an unparalleled experience that caters to all your needs.
        </p>
      </section>

      <div className="about" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Title Section */}
        <div style={sectionStyle}>
          <h1 style={{ ...titleStyle, color: 'white' }}>GRAND HOTEL</h1>
        </div>
        {/* Welcome Section */}
        <section style={{
          ...sectionStyle,
          backgroundImage: 'url("https://www.furoregrandhotel.com/wp-content/uploads/2023/11/DSC04194-HDR_1918x1084.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textShadow: '2px 2px 4px black',
        }}>
          <h2>Welcome to Grand Hotel</h2>
          <p>
            Nestled in the heart of Mexico, Grands Hotel offers a unique blend of modern luxury and timeless elegance.
            Our hotel is more than just a place to stay—it's a destination that brings the vibrant spirit of Mexico-City to life.
            Whether you’re here for business, leisure, or a special occasion, we provide an unparalleled experience that caters to all your needs.
          </p>
        </section>

        {/* Our History Section */}
        <section style={{
          ...sectionStyle,
          backgroundImage: 'url("https://www.furoregrandhotel.com/wp-content/uploads/2023/11/DSC04194-HDR_1918x1084.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textShadow: '2px 2px 4px black',
        }}>
          <h2>Our History</h2>
          <p>
            Established in 2010, Grands Hotel has a rich history that reflects the heritage and culture of Mexico-City.
            Originally designed by Billy-Michaels, the hotel has undergone several renovations to maintain its classic charm
            while incorporating contemporary amenities. Our legacy of hospitality has made us a landmark in Mexico-City, beloved
            by locals and travelers alike.
          </p>
        </section>

        {/* Our Rooms & Suites Section */}
        <section style={{
          ...sectionStyle,
          backgroundImage: 'url("https://www.furoregrandhotel.com/wp-content/uploads/2023/11/DSC04194-HDR_1918x1084.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textShadow: '2px 2px 4px black',
        }}>
          <h2>Our Rooms & Suites</h2>
          <p>
            Grand hotel offers Variety of elegantly appointed rooms and suites, each thoughtfully designed to provide comfort and luxury.
            Our accommodations range from cozy standard rooms to expansive luxury suites, perfect for both short stays and extended visits.
          </p>
          <ul style={{ fontSize: '28px', textAlign: 'left', margin: '0 auto', maxWidth: '800px' }}>
            <li>Luxurious bedding with high-thread-count linens.</li>
            <li>En-suite bathrooms with rain showers, soaking tubs, and premium toiletries.</li>
            <li>Smart technology, including high-speed Wi-Fi, flat-screen TVs, and in-room tablets for service requests.</li>
            <li>Stunning views of Mexico depending on your room selection.</li>
          </ul>
          <p>
            For those seeking an elevated experience, our suites offer additional space, exclusive access to the Executive Lounge,
            and personalized concierge services.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
