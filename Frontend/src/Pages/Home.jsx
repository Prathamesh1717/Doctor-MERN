import React from 'react'
import Banner from '../Components/Banner.jsx'
import Navbar from '../Components/Navbar.jsx'
import Certification from '../Components/Certification.jsx'
import HomeDoctors from '../Components/HomeDoctors.jsx'
import Testimonial from '../Components/Testimonial.jsx'
import Footer from '../Components/Footer.jsx'
const Home = () => {
  return (
    <div>
      <Navbar />
      <Banner />
      <Certification />
      <HomeDoctors />
      <Testimonial />
      <Footer />
    </div>
  )
}

export default Home;
