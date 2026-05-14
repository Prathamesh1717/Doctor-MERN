import React, { useEffect, useState } from 'react'
import Home from './Pages/Home.jsx'

// import Navbar from './Components/Navbar.jsx'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Doctors from './Pages/Doctors.jsx'
import DoctorDetails from './Pages/DoctorDetails.jsx'
import Service from './Pages/Service.jsx'
import ServiceDetailPage from './Pages/ServiceDetailPage.jsx'
import Contact from './Pages/Contact.jsx'
import Login from './Pages/Login.jsx'
import DHome from './Pages/DHome.jsx'
import List from './doctor/List.jsx'
import EditProfile from './doctor/EditProfile.jsx'
import Appointments from './Pages/Appointments.jsx'
import { CircleChevronUp } from 'lucide-react'
import VerifyPaymentPage from '../VerifyPaymentPage.jsx'
import VerifyServicePaymentPage from '../VerifyServicePaymentPage.jsx'

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  },[pathname]);
  return null;
}

// scroll btn
const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollTop}
      className={`fixed right-4 bottom-6 z-50 w-11 h-11 rounded-full flex items-center justify-center 
      bg-emerald-600 text-white shadow-lg transition-all duration-300 
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} 
      hover:scale-110 hover:shadow-xl`}
      title="Go to top"
    >
      <CircleChevronUp size={22} />
    </button>
  );
};

const App = () => {
  //to lock horizontal overflow for all pages
   useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
      document.documentElement.style.overflowX = "auto";
    };
  }, []);
  return (
    <>
    <ScrollToTop />
    {/* <Navbar /> */}
    <div className="overflow-x-hidden bg-white text-gray-900">
    <Routes>
      <Route path = "/" element={<Home />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/doctors/:id" element={<DoctorDetails />} />

      <Route path="/services" element={<Service />} />
      <Route path="/services/:id" element ={<ServiceDetailPage />} />

      <Route path= "/contact" element={<Contact />} />

      <Route path="/doctor-admin/login" element={<Login />} />
      <Route path="/doctor-admin/:id" element={<DHome />} />
      <Route path="/doctor-admin/:id/appointments" element={<List />} />
      <Route path="/doctor-admin/:id/profile/edit" element = {<EditProfile />} />

      <Route path="/appointments" element={<Appointments />} />
      <Route path="/appointment/success" element = {<VerifyPaymentPage />} />
      <Route path="/appointment/cancel" element = {<VerifyPaymentPage />} />
      <Route path="/service-appointment/success" element = {<VerifyServicePaymentPage />} />
      <Route path="/service-appointment/cancel" element = {<VerifyServicePaymentPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </div>
    <ScrollButton />
    </>
  )
}       

export default App;
