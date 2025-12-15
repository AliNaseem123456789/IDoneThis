import React from "react";
import CalendarDashboard from "../components/CalendarDashboard";
import NavbarLoggedIn from "../components/NavbarLoggedIn";
const Calendar= () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <NavbarLoggedIn/>

  
        <CalendarDashboard />
  
    </div>
  );
};

export default Calendar;