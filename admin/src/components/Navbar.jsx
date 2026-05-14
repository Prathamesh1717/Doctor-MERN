import React, { useEffect, useRef, useState,useCallback,useLayoutEffect } from 'react'
import { navbarStyles as ns } from '../assets/dummyStyles.js';
import logoImg from '../assets/logo.png';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, UserPlus, Users, Calendar, Grid, PlusSquare, List, Menu, X } from 'lucide-react';
import { useAuth, useClerk, useUser } from '@clerk/react';
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navInnerRef = useRef(null);
  const indicatorRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  //clerk
  const clerk = useClerk?.();
  const {getToken,isLoaded:authLoaded} = useAuth();
  const{isSignedIn,user,isLoaded:userLoaded} = useUser();

  //sliding indicator logic
    const moveIndicator = useCallback(() => {
    const container = navInnerRef.current;
    const ind = indicatorRef.current;
    if (!container || !ind) return;

    const active = container.querySelector(".nav-item.active");
    if (!active) {
      ind.style.opacity = "0";
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();

    const left = activeRect.left - containerRect.left + container.scrollLeft;
    const width = activeRect.width;

    ind.style.transform = `translateX(${left}px)`;
    ind.style.width = `${width}px`;
    ind.style.opacity = "1";
  }, []);

  useLayoutEffect(() => {
    moveIndicator();
    const t = setTimeout(() => {
      moveIndicator();
    }, 120);
    return () => clearTimeout(t);
  }, [location.pathname, moveIndicator]);

  //it will help scrolling in x axis
  useEffect(() => {
    const container = navInnerRef.current;
    if (!container) return;

    const onScroll = () => {
      moveIndicator();
    };
    container.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => {
      moveIndicator();
    });
    ro.observe(container);
    if (container.parentElement) ro.observe(container.parentElement);

    window.addEventListener("resize", moveIndicator);

    moveIndicator();

    return () => {
      container.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.removeEventListener("resize", moveIndicator);
    };
  }, [moveIndicator]);

  //it will move the indicator to the active nav item on initial load and whenever the path changes
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

//when user clicks on sign out button
useEffect(() => {
  let mounted = true;
  const storeToken = async() => {
    if(!authLoaded || !userLoaded) return;
    if(!isSignedIn){
      try{
        localStorage.removeItem("clerk_token");
      }catch(err){
      }
      return;
    }
    try{
if(getToken){
  const token = await getToken();
  if(!mounted) return;
  if(token){
    try{
localStorage.setItem("clerk_token",token);
    }catch(err){
      console.warn("Failed to store token in localStorage", err);
}
  }
}
    
    }catch(err){
console.warn("Failed to get token", err);
    }
  }
  storeToken();
  return () => {
    mounted = false;
  };
},[isSignedIn, getToken, authLoaded, userLoaded]);

//open clerk sign in page when login button is clicked
const handleOpenSignIn = () => {
  if(!clerk || !clerk.openSignIn) {
    console.warn("clerk is not available");
    return;
  }
  clerk.openSignIn();
  navigate("/h");
};

//handle sign out
const handleSignOut = async() => {
  if(!clerk || !clerk.signOut) {
    console.warn("clerk is not available");
    return;
  }
  try{
await clerk.signOut();
  }catch(err){
    console.warn("Failed to sign out", err);
  }finally{
    localStorage.removeItem("clerk_token");
  }
  navigate("/h");
}

  return (
   <header className={ns.header}>
    <nav className={ns.navContainer}>
      <div className={ns.flexContainer}>
        <div className={ns.logoContainer}>
  <Link to="/" className="flex items-center gap-2">
    <img src={logoImg} alt="logo" className={ns.logoImage} />
    <div>
      <div className={ns.logoLink}>MediCare</div>
      <div className={ns.logoSubtext}>Healthcare Solution</div>
    </div>
  </Link>
</div>

        {/* Mobile menu button */}
        <button 
          onClick={() => setOpen(!open)}
          className={`${ns.mobileMenuButton} z-30`}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* center navigation */}
        <div className={ns.centerNavContainer}>
          <div className={ns.glowEffect}>
            <div className={ns.centerNavInner}>
             <div ref={navInnerRef} tabIndex={0} className={ns.centerNavScrollContainer} 
             style={{
              WebkitOverflowScrolling:"touch"
             }}>
         <CenterNavItem
                    to="/h"
                    label="Dashboard"
                    icon={<Home size={16} />}
                  />
                  <CenterNavItem
                    to="/add"
                    label="Add Doctor"
                    icon={<UserPlus size={16} />}
                  />
                  <CenterNavItem
                    to="/list"
                    label="List Doctors"
                    icon={<Users size={16} />}
                  />
                  <CenterNavItem
                    to="/appointments"
                    label="Appointments"
                    icon={<Calendar size={16} />}
                  />
                  <CenterNavItem
                    to="/service-dashboard"
                    label="Service Dashboard"
                    icon={<Grid size={16} />}
                  />
                  <CenterNavItem
                    to="/add-service"
                    label="Add Service"
                    icon={<PlusSquare size={16} />}
                  />
                  <CenterNavItem
                    to="/list-service"
                    label="List Services"
                    icon={<List size={16} />}
                  />
                  <CenterNavItem
                    to="/service-appointments"
                    label="Service Appointments"
                    icon={<Calendar size={16} />}
                  />
             </div>
            </div>
          </div>
        </div>
 {/* Mobile navigation menu */}
        {open && (
          <>
            <div
              className={ns.mobileOverlay}
              onClick={() => setOpen(false)}
            />

            <div className={ns.mobileMenuContainer} id="mobile-menu">
              <div className={ns.mobileMenuInner}>
                <MobileItem
                  to="/h"
                  label="Dashboard"
                  icon={<Home size={16} />}
                  onClick={() => setOpen(false)}
                />

                <MobileItem
                  to="/add"
                  label="Add Doctor"
                  icon={<UserPlus size={16} />}
                  onClick={() => setOpen(false)}
                />

                <MobileItem
                  to="/list"
                  label="List Doctors"
                  icon={<Users size={16} />}
                  onClick={() => setOpen(false)}
                />

                <MobileItem
                  to="/appointments"
                  label="Appointments"
                  icon={<Calendar size={16} />}
                  onClick={() => setOpen(false)}
                />

                <MobileItem
                  to="/service-dashboard"
                  label="Service Dashboard"
                  icon={<Grid size={16} />}
                  onClick={() => setOpen(false)}
                />

                <MobileItem
                  to="/add-service"
                  label="Add Service"
                  icon={<PlusSquare size={16} />}
                  onClick={() => setOpen(false)}
                />

                <MobileItem
                  to="/list-service"
                  label="List Services"
                  icon={<List size={16} />}
                  onClick={() => setOpen(false)}
                />

                <MobileItem
                  to="/service-appointments"
                  label="Service Appointments"
                  icon={<Calendar size={16} />}
                  onClick={() => setOpen(false)}
                />

                <div className={ns.mobileAuthContainer}>
                  {isSignedIn ? (
                    <button
                      onClick={() => {
                        handleSignOut();
                        setOpen(false);
                      }}
                      className={ns.mobileSignOutButton}
                    >
                      Sign Out
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          handleOpenSignIn();
                          setOpen(false);
                        }}
                        className={`${ns.mobileLogInButton} ${ns.cursorPointer}`}
                      >
                        Login
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {/* Right Side */}
        <div className={ns.rightContainer}>
        {isSignedIn ? (
          <button onClick={handleSignOut} className={ns.signOutButton + " " + ns.cursorPointer}>
            Sign Out
          </button>
        ) : (
          <div className= "hidden lg:flex items-center gap-2">
            <button onClick={handleOpenSignIn} className={ns.loginButton + " " + ns.cursorPointer}>
              Login
            </button>

          </div>
        )}
       
        </div>
      </div>
    </nav>
   </header>
  )
}

export default Navbar;
function CenterNavItem({ to, label, icon }) {
return (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `nav-item ${isActive ? "active" : ""} ${ns.centerNavItemBase} ${
        isActive ? ns.centerNavItemActive : ns.centerNavItemInactive
      }`
    }
  >
    <span>{icon}</span>
    <span className="font-medium">{label}</span>
  </NavLink>
);

}

function MobileItem({ to, label, icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `${ns.mobileItemBase} ${
          isActive ? ns.mobileItemActive : ns.mobileItemInactive
        }`
      }
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </NavLink>
  );
}