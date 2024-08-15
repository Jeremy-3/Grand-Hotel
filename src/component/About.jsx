import React from "react";
import "./About.css";

const About = () => {
  const sectionStyle = {
    backgroundImage:
      'url("https://www.furoregrandhotel.com/wp-content/uploads/2023/11/DSC04194-HDR_1918x1084.jpg")',
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "50px",
    textAlign: "center",
    fontSize: "36px",
  };

  const titleStyle = {
    fontSize: "72px",
    fontWeight: "bold",
    margin: "0",
    fontFamily: '"Comic Sans MS", cursive',
  };

  return (
    <div id="About">
      <div className="about">
        <div style={{ fontFamily: "Arial, sans-serif" }}>
          {/* Logo Section */}
          {/* <div style={{ marginBottom: '20px', 
        textAlign: 'center',
        position: 'sticky', 
        top: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '10px 20px',
        fontSize: '25px',
        display: 'flex',
        gap: '30px',
        zIndex: 1000,  }}>
        <img
          src="https://static.vecteezy.com/system/resources/previews/013/087/536/original/illustration-logo-grand-hotel-boutique-vintage-design-free-vector.jpg"
          alt="Grand Hotel Logo"
          style={{ height: '80px' }}
        />
      </div> */}

          {/* Title Section */}
          <div style={sectionStyle}>
            <h1 style={{ ...titleStyle, color: "white" }}>GRAND HOTEL</h1>
          </div>

          {/* Sections */}
          <section
            style={{
              ...sectionStyle,
              backgroundImage:
                'url("https://www.furoregrandhotel.com/wp-content/uploads/2023/11/DSC04194-HDR_1918x1084.jpg")',
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              color: "white",
              textShadow: "2px 2px 4px black",
            }}
          >
            <h2>Welcome to Grand Hotel</h2>
            <p>
              Nestled in the heart of Mexico, Grands Hotel offers a unique blend
              of modern luxury and timeless elegance. Our hotel is more than
              just a place to stay—it's a destination that brings the vibrant
              spirit of Mexico-City to life. Whether you’re here for business,
              leisure, or a special occasion, we provide an unparalleled
              experience that caters to all your needs.
            </p>
          </section>

          <section
            style={{
              ...sectionStyle,
              backgroundImage:
                'url("https://www.furoregrandhotel.com/wp-content/uploads/2023/11/DSC04194-HDR_1918x1084.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
              textShadow: "2px 2px 4px black",
            }}
          >
            <h2>Our History</h2>
            <p>
              Established in 2010, Grands Hotel has a rich history that reflects
              the heritage and culture of Mexico-City. Originally designed by
              Billy-Michaels, the hotel has undergone several renovations to
              maintain its classic charm while incorporating contemporary
              amenities. Our legacy of hospitality has made us a landmark in
              Mexico-City, beloved by locals and travelers alike.
            </p>
          </section>

          <section
            style={{
              ...sectionStyle,
              backgroundImage:
                'url("https://www.furoregrandhotel.com/wp-content/uploads/2023/11/DSC04194-HDR_1918x1084.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
              textShadow: "2px 2px 4px black",
            }}
          >
            <h2>Our Rooms & Suites</h2>
            <p>
              Grand hotel offers Variety of elegantly appointed rooms and
              suites, each thoughtfully designed to provide comfort and luxury.
              Our accommodations range from cozy standard rooms to expansive
              luxury suites, perfect for both short stays and extended visits.
            </p>
            <ul
              style={{
                fontSize: "28px",
                textAlign: "left",
                margin: "0 auto",
                maxWidth: "800px",
              }}
            >
              <li>Luxurious bedding with high-thread-count linens.</li>
              <li>
                En-suite bathrooms with rain showers, soaking tubs, and premium
                toiletries.
              </li>
              <li>
                Smart technology, including high-speed Wi-Fi, flat-screen TVs,
                and in-room tablets for service requests.
              </li>
              <li>
                Stunning views of Mexico depending on your room selection.
              </li>
            </ul>
            <p>
              For those seeking an elevated experience, our suites offer
              additional space, exclusive access to the Executive Lounge, and
              personalized concierge services.
            </p>
          </section>

          <section
            style={{
              ...sectionStyle,
              backgroundImage:
                'url("https://www.furoregrandhotel.com/wp-content/uploads/2023/11/DSC04194-HDR_1918x1084.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
              textShadow: "2px 2px 4px black",
            }}
          >
            <h2>Dining & Culinary Excellence</h2>
            <p>
              Indulge in a culinary journey at Mexico-City, where our
              award-winning chefs craft dishes inspired by local and
              international flavors. Our dining options include:
            </p>
            <ul
              style={{
                fontSize: "28px",
                textAlign: "left",
                margin: "0 auto",
                maxWidth: "800px",
              }}
            >
              <li>
                <strong>Restarant</strong> A fine-dining restaurant offering a
                seasonal menu with a focus on locally sourced ingredients.
              </li>
              <li>
                <strong>Bistro:</strong> A casual dining spot perfect for a
                quick breakfast, lunch, or evening snack, featuring a variety of
                global cuisines.
              </li>
              <li>
                <strong>Lounge</strong> A chic, intimate space where you can
                enjoy handcrafted cocktails, fine wines, and a selection of
                premium spirits.
              </li>
            </ul>
            <p>
              Our chefs also cater to special dietary needs, ensuring all guests
              enjoy a memorable dining experience.
            </p>
          </section>
          <section
            style={{
              ...sectionStyle,
              backgroundImage:
                'url("https://www.furoregrandhotel.com/wp-content/uploads/2023/11/DSC04194-HDR_1918x1084.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
              textShadow: "2px 2px 4px black",
            }}
          >
            <h2>Amenities & Services</h2>
            <p>
              At Grand-Hotel, we believe in offering more than just a place to
              stay. Our extensive range of amenities and services ensures your
              stay is comfortable, convenient, and enjoyable:
            </p>
            <ul
              style={{
                fontSize: "28px",
                textAlign: "left",
                margin: "0 auto",
                maxWidth: "800px",
              }}
            >
              <li>
                24-hour concierge service to assist with travel arrangements,
                local recommendations, and special requests.
              </li>
              <li>
                State-of-the-art fitness center with the latest equipment and
                personal training services.
              </li>
              <li>
                Luxury spa offering a range of treatments, including massages,
                facials, and body therapies.
              </li>
              <li>
                Heated outdoor/indoor pool with a poolside bar and lounge chairs
                for relaxation.
              </li>
              <li>
                Business center with meeting rooms, conference facilities, and
                high-speed internet access.
              </li>
              <li>
                Complimentary shuttle service to key locations within the city.
              </li>
              <li>Valet parking and car rental services.</li>
            </ul>
          </section>

          <section
            style={{
              ...sectionStyle,
              backgroundImage:
                'url("https://www.furoregrandhotel.com/wp-content/uploads/2023/11/DSC04194-HDR_1918x1084.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
              textShadow: "2px 2px 4px black",
            }}
          >
            <h2>Events & Meetings</h2>
            <p>
              Whether you're planning a corporate event, wedding, or social
              gathering, [Hotel Name] provides the perfect venue. Our event
              spaces include:
            </p>
            <ul
              style={{
                fontSize: "28px",
                textAlign: "left",
                margin: "0 auto",
                maxWidth: "800px",
              }}
            >
              <li>
                <strong>Grand Ballroom:</strong> Ideal for weddings, galas, and
                large conferences, accommodating up to [Capacity] guests.
              </li>
              <li>
                <strong>Executive Boardrooms:</strong> Equipped with the latest
                AV technology, perfect for meetings and presentations.
              </li>
              <li>
                <strong>Outdoor Terraces:</strong> Offering scenic views, ideal
                for cocktail receptions and intimate gatherings.
              </li>
            </ul>
            <p>
              Our dedicated event planning team works closely with you to ensure
              every detail is taken care of, from catering to decor, to make
              your event a success.
            </p>
          </section>

          <section
            style={{
              ...sectionStyle,
              backgroundImage:
                'url("https://www.furoregrandhotel.com/wp-content/uploads/2023/11/DSC04194-HDR_1918x1084.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
              textShadow: "2px 2px 4px black",
            }}
          >
            <h2>Location & Nearby Attractions</h2>
            <p>
              Located in the heart of [City Name], [Hotel Name] offers easy
              access to the city's most popular attractions, including:
            </p>
            <ul
              style={{
                fontSize: "28px",
                textAlign: "left",
                margin: "0 auto",
                maxWidth: "800px",
              }}
            >
              <li>
                <strong>[Attraction 1]:</strong> A short 20-minute walk/drive
                from the hotel, perfect for cultural enthusiasts.
              </li>
              <li>
                <strong>[Attraction 2]:</strong> Known for its breathtaking
                views/history, located [X] miles away.
              </li>
              <li>
                <strong>[Shopping District/Area]:</strong> Explore luxury
                boutiques, local markets, and trendy shops, all within walking
                distance.
              </li>
              <li>
                <strong>[Public Transport Hub]:</strong> Convenient access to
                Mexico's public transport, making it easy to explore the entire
                city.
              </li>
            </ul>
          </section>

          <section
            style={{
              ...sectionStyle,
              backgroundImage:
                'url("https://www.furoregrandhotel.com/wp-content/uploads/2023/11/DSC04194-HDR_1918x1084.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
              textShadow: "2px 2px 4px black",
            }}
          >
            <h2>Sustainability & Community</h2>
            <p>
              At Grand-Hotel, we are committed to sustainability and community
              engagement. We have implemented eco-friendly practices such as:
            </p>
            <ul
              style={{
                fontSize: "28px",
                textAlign: "left",
                margin: "0 auto",
                maxWidth: "800px",
              }}
            >
              <li>
                Energy-efficient lighting and water-saving fixtures throughout
                the hotel.
              </li>
              <li>Recycling programs and the use of biodegradable products.</li>
              <li>
                Locally sourced and organic ingredients in our restaurants to
                support local farmers and reduce our carbon footprint.
              </li>
            </ul>
            <p>
              We also partner with local charities and participate in community
              events to give back to the city that has welcomed us so warmly.
            </p>
          </section>

          <section
            style={{
              ...sectionStyle,
              backgroundImage:
                'url("https://www.furoregrandhotel.com/wp-content/uploads/2023/11/DSC04194-HDR_1918x1084.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
              textShadow: "2px 2px 4px black",
            }}
          >
            <h2>Awards & Accolades</h2>
            <p>
              Over the years, Grand-Hotel has been honored with numerous awards,
              including:
            </p>
            <ul
              style={{
                fontSize: "28px",
                textAlign: "left",
                margin: "0 auto",
                maxWidth: "800px",
              }}
            >
              <li>
                <strong>[Award Name]:</strong> Recognized for our exceptional
                service and facilities.
              </li>
              <li>
                <strong>[Award Name]:</strong> Voted as one of the top hotels in
                Mexico.
              </li>
              <li>
                <strong>[Award Name]:</strong> Our Bar has received accolades
                for its innovative offerings.
              </li>
            </ul>
            <p>
              These recognitions are a testament to our unwavering commitment to
              excellence.
            </p>
          </section>

          <section
            style={{
              ...sectionStyle,
              backgroundImage:
                'url("https://www.furoregrandhotel.com/wp-content/uploads/2023/11/DSC04194-HDR_1918x1084.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
              textShadow: "2px 2px 4px black",
            }}
          >
            <h2>Guest Reviews</h2>
            <p>
              Don’t just take our word for it—see what our guests have to say:
            </p>
            <blockquote>
              <p>
                "[Guest Review 1]: [Snippet of a positive review highlighting a
                particular aspect of the hotel]."
              </p>
            </blockquote>
            <blockquote>
              <p>
                "[Guest Review 2]: [Snippet of a positive review focusing on
                service, amenities, or location]."
              </p>
            </blockquote>
            <p>
              Our guests' satisfaction is our top priority, and we are proud to
              have a loyal base of returning visitors.
            </p>
          </section>

          <section
            style={{
              ...sectionStyle,
              backgroundImage:
                'url("https://www.furoregrandhotel.com/wp-content/uploads/2023/11/DSC04194-HDR_1918x1084.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
              textShadow: "2px 2px 4px black",
            }}
          >
            <h2>Contact Us</h2>
            <p>
              For reservations, inquiries, or further information, please
              contact us at:
            </p>
            <ul
              style={{
                fontSize: "28px",
                textAlign: "left",
                margin: "0 auto",
                maxWidth: "800px",
              }}
            >
              <li>
                <strong>Phone:</strong> 03334556745
              </li>
              <li>
                <strong>Email:</strong> fg@yyhvkuh.trdt
              </li>
              <li>
                <strong>Address:</strong> rtcytvjhuynjn
              </li>
            </ul>
            <p>
              We look forward to welcoming you to Grands hotel, where your
              comfort and satisfaction are our highest priorities. Whether
              you're here for a night or an extended stay, we are committed to
              making your experience unforgettable.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
