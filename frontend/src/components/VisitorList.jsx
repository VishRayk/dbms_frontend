import React, { useState, useEffect } from "react";
import axios from "axios"
export default function VisitorList() {
  const [visitors, setVisitors] = useState([]);
  const [filter, setFilter] = useState("current");
  const [loading, setLoading] = useState(true);
  const boole=localStorage.getItem('guardLoggedIn')&&localStorage.getItem('token')
  var token=null;
  if(boole){
     token=localStorage.getItem('token');
  }
  const fetchVisitors = async () => {
    setLoading(true);
    try {
      let url;
      if (filter === "scheduled") {
        url = "http://localhost:3000/visitor/scheduled";
      } else {
        url = `http://localhost:3000/visitor/${filter}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setVisitors(data.visitors);
      } else {
        alert("Error fetching visitors");
      }
    } catch (error) {
      console.error("Error fetching visitors:", error);
      alert("Error showing scheduled visitors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [filter]);

  const handleCheckout = async (visitorId) => {
    if (!visitorId) {
      console.error("No visitor ID provided");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/visitor/checkout/${visitorId}`, {
        method: "POST",
      });

      const result = await response.json();
      if (response.ok) {
        alert("Visitor checked out successfully!");
        fetchVisitors();
      } else {
        alert(result.message || "Checkout failed");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Error checking out visitor");
    }
  };

  const handleAcceptAppointment = async (appointmentId) => {
    if (!appointmentId) {
      alert("Invalid appointment ID");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:3000/appointments/accept-appointment",
        { appointment_id: appointmentId },
        {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );
  
      alert("Appointment accepted and visitor added!");
      fetchVisitors(); // refresh list
    } catch (err) {
      console.error("Error accepting appointment:", err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Server error accepting appointment");
      }
    }
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-[#393086] to-[#cf5924]"></div>

      <div className="relative z-10 w-full max-w-6xl bg-white bg-opacity-95 rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-8 pt-8 pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#393086] mb-6">
            Visitor Management
          </h2>

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setFilter("current")}
              className={`px-5 py-2 rounded-xl font-medium transition-all duration-300 
                ${filter === "current"
                  ? "bg-[#393086] text-white shadow-md hover:bg-[#2f276e]"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            >
              Current Visitors
            </button>

            <button
              onClick={() => setFilter("checkedout")}
              className={`px-5 py-2 rounded-xl font-medium transition-all duration-300 
                ${filter === "checkedout"
                  ? "bg-[#393086] text-white shadow-md hover:bg-[#2f276e]"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            >
              Checked-out Visitors
            </button>

            <button
              onClick={() => setFilter("scheduled")}
              className={`px-5 py-2 rounded-xl font-medium transition-all duration-300 
                ${filter === "scheduled"
                  ? "bg-[#393086] text-white shadow-md hover:bg-[#2f276e]"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            >
              Scheduled Visitors
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#393086]"></div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
              <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visiting Whom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In-Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Out-Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    {(filter === "current" || filter === "scheduled") && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visitors.length === 0 ? (
                    <tr>
                      <td colSpan={filter === "current" || filter === "scheduled" ? 7 : 6} className="px-6 py-10 text-center text-gray-500">
                        No visitors to display.
                      </td>
                    </tr>
                  ) : (
                    visitors.map((visitor) => (
                      <tr key={visitor.visid || visitor.appointment_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{visitor.visitor_name || visitor.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.visitor_phone || visitor.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.visiting_whom || visitor.faculty_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.intime || visitor.visit_date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.outtime || "—"}</td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                          {visitor.photo_url ? (
                            <a
                              href={`http://localhost:3000${visitor.photo_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline text-blue-600"
                            >
                              View Image
                            </a>
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </td>

                        {filter === "current" && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleCheckout(visitor.visid)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                              Checkout
                            </button>
                          </td>
                        )}

                        {filter === "scheduled" && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleAcceptAppointment(visitor.appointment_id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                            >
                              Accept
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-10 text-center text-sm text-gray-500">
            <p>© 2025 Indian Institute of Information Technology, Nagpur</p>
          </div>
        </div>
      </div>
    </div>
  );
}
