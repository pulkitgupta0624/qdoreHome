import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User,
  MapPin,
  Package,
  LogOut,
  Edit,
  Plus,
  ArrowRight,
  X,
  Lock,
} from "lucide-react";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";

const MyProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    mobile: "",
  });

  useEffect(() => {
    if (userInfo && userInfo._id) {
      fetchUserDetails(userInfo._id);
      fetchUserOrders(userInfo._id);
    } else {
      navigate("/auth");
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (userDetails) {
      setEditFormData({
        username: userDetails.username || "",
        email: userDetails.email || "",
        mobile: userDetails.mobile || "",
      });
    }
  }, [userDetails]);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        `https://qdore-backend-final-final-last.vercel.app/api/users/user-details/${userId}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      const userData = response.data;
      setUserDetails(userData);
      setAddresses(userData.addresses || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load user details");
      setLoading(false);
    }
  };

  const fetchUserOrders = async (userId) => {
    try {
      const response = await axios.get(
        `https://qdore-backend-final-final-last.vercel.app/api/users/orders/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("userInfo");
    navigate("/auth");
    toast.success("Logged out successfully");
  };

  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://qdore-backend-final-final-last.vercel.app/api/users/update-profile/${userInfo._id}`,
        editFormData,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      if (response.data) {
        setUserDetails({ ...userDetails, ...editFormData });
        toast.success("Profile updated successfully");
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleAddAddress = () => {
    navigate("/add-address");
  };

  const handleChangePassword = () => {
    navigate("/changepassword");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 font-sans">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-6xl text-center font-roboto font-bold mb-8 text-gray-900 font-serif">
            My Profile
          </h1>

          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="flex border-b">
              {["profile", "addresses", "orders"].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-4 px-6 text-center font-semibold ${activeTab === tab
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                    } transition duration-300`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "profile" && <User className="inline-block mr-2" />}
                  {tab === "addresses" && (
                    <MapPin className="inline-block mr-2" />
                  )}
                  {tab === "orders" && (
                    <Package className="inline-block mr-2" />
                  )}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "profile" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-4xl font-semibold text-gray-900 font-serif">
                      Welcome, {userDetails.username || userInfo.username}!
                    </h2>

                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {["email", "mobile"].map((field) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                          type={field === "email" ? "email" : "text"}
                          value={userDetails[field] || userInfo[field] || "N/A"}
                          readOnly
                          className="w-full p-3 rounded-lg bg-gray-100 text-gray-700 border border-gray-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "addresses" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 font-serif">
                      Saved Addresses
                    </h2>
                    <button
                      onClick={handleAddAddress}
                      className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition duration-300 flex items-center"
                    >
                      <Plus className="mr-2" size={18} /> Add New Address
                    </button>
                  </div>
                  {addresses.length > 0 ? (
                    addresses.map((address, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 p-4 rounded-lg mb-4 shadow"
                      >
                        <p className="font-semibold text-lg text-gray-800 mb-2">
                          {address.isDefault
                            ? "Default Address"
                            : `Address ${idx + 1}`}
                        </p>
                        <p className="text-gray-600">{address.addressLine1}</p>
                        <p className="text-gray-600">{address.addressLine2}</p>
                        <p className="text-gray-600">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No addresses found. Add a new address to get started!
                    </p>
                  )}
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 font-serif">
                    Your Orders
                  </h2>
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg mb-6 shadow"
                      >
                        <p className="font-semibold text-lg text-gray-800 mb-2">
                          Order #{index + 1}
                        </p>
                        <p className="text-gray-600 mb-2">
                          Date: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex flex-wrap gap-4 mb-4">
                          {order.products.map((product, idx) => (
                            <div key={idx} className="flex items-center">
                              <img
                                src={`https://ipfs.io/ipfs/${product.image}`}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg mr-4 shadow"
                              />
                              <span className="text-gray-700 font-medium">
                                {product.name}
                              </span>
                            </div>
                          ))}
                        </div>
                        <button
                          className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition duration-300 flex items-center"
                          onClick={() => handleOrderClick(order._id)}
                        >
                          View Details <ArrowRight className="ml-2" size={18} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No orders found. Start shopping to see your orders here!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleEditProfile}
            className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition duration-300 flex items-center"
          >
            <Edit className="mr-2" size={18} /> Edit Profile
          </button>
          <button
            onClick={handleChangePassword}
            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-500 transition duration-300 flex items-center"
          >
            <Lock className="mr-2" size={18} /> Change Password
          </button>

          <button
            onClick={handleLogout}
            className="mt-4 bg-gray-800 text-white px-6 py-3 rounded-full shadow hover:bg-gray-700 transition duration-300 flex items-center"
          >
            <LogOut className="mr-2" size={18} /> Logout
          </button>
        </div>
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Edit Profile
              </h2>
              <form onSubmit={handleEditFormSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={editFormData.username}
                    onChange={handleEditFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    autoComplete="off" // Disable autofill
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    autoComplete="off" // Disable autofill
                  />
                </div>
                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mobile
                  </label>
                  <input
                    type="text"
                    id="mobile"
                    name="mobile"
                    value={editFormData.mobile}
                    onChange={handleEditFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    autoComplete="off" // Disable autofill
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyProfile;