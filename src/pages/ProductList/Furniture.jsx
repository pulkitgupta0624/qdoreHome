import React, { useEffect, useState } from "react";
import { FaTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast for notifications
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { useDispatch, useSelector } from "react-redux";
import image1 from "../../assets/Front/virgo.jpg";
import image2 from "../../assets/Front/orbit.jpg";
import image3 from "../../assets/Front/pluto.jpg";
import image4 from "../../assets/Front/vega.jpg";
import image5 from "../../assets/sidetables/side4.jpg";
import image6 from "../../assets/Front/cosmic.png";

import AOS from "aos";
import "aos/dist/aos.css";

const SideTable = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const products = [
    { id: "virgo-side-table", name: "VIRGO SIDE TABLE", image: image1, originalPrice: 9500, discountedPrice: 250 },
    { id: "orbit-side-table", name: "ORBIT SIDE TABLE", image: image2, originalPrice: 7700, discountedPrice: 250 },
    { id: "pluto-side-table", name: "PLUTO SIDE TABLE", image: image3, originalPrice: 9500, discountedPrice: 250 },
    { id: "vega-side-table", name: "VEGA SIDE TABLE", image: image4, originalPrice: 9500, discountedPrice: 250 },
    { id: "acacia-wood-side-table", name: "ACACIA WOOD SIDE TABLE", image: image5, originalPrice: 9500, discountedPrice: 250 },
    { id: "the-cosmic-mirror-side-table", name: "THE COSMIC MIRROR SIDE TABLE", image: image6, originalPrice: 25000, discountedPrice: 250 }, 
  ];

  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `https://qdore-backend-final-final-last.vercel.app/api/users/objectIdexport?fbUserId=${userInfo.fbUserId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error fetching user data: " + error.message);
      return null;
    }
  };

  const handleAddToCart = async (product) => {
    if (!userInfo) {
      navigate("/auth");
      return;
    }
    const token = userInfo?.token;

    if (!token) {
      toast.error("Authentication token is missing.");
      return;
    }

    const userData = await fetchUserData();
    if (!userData || !userData._id) {
      toast.error("Failed to fetch user information.");
      return;
    }

    const mongoUserId = userData._id;

    try {
      const response = await fetch(
        "https://qdore-backend-final-final-last.vercel.app/api/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: mongoUserId,
            productId: product.id,
            name: product.name,
            price: Number(product.originalPrice),
            image: product.image,
            quantity: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      setActiveProduct(product);
      setModalVisible(true);
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  const handleNavigation = (product) => {
    console.log("Navigating to:", product.id);
    navigate(`/furniture/side-table/${product.id}`);
  };

  useEffect(() => {
    console.log("Products:", products);
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white min-h-screen">
      <Navbar />
      <h1 className="text-center text-2xl font-normal font-montserrat mt-4">FURNITURE</h1>
      <div className="container mx-auto px-5 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col justify-between"
              data-aos="fade-up"
            >
              <img
                src={product.image}
                onClick={() => handleNavigation(product)}
                alt={product.name}
                className="w-full h-65 object-cover transition-opacity duration-300 hover:opacity-80 cursor-pointer"
              />
              <div className="p-4 flex flex-col justify-between h-full">
                <h2 className="text-2xl text-center font-semibold mb-2">
                  {product.name}
                </h2>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-black font-semibold">
                      ₹{product.originalPrice}
                    </span>
                  </div>
                  <FaTag className="text-gray-400" />
                </div>
                <div className="mt-4 flex justify-between gap-4">
                  <button
                    onClick={() => handleNavigation(product)}
                    className="bg-black w-1/2 text-white text-xl px-5 py-2 rounded transition-transform duration-300 hover:scale-105"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-black w-1/2 text-white text-xl px-5 py-2 rounded transition-transform duration-300 hover:scale-105"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />

      {/* Modal for Product Added Confirmation */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 text-center">
            <h3 className="text-xl font-semibold mb-3">Product Added!</h3>
            <img
              src={activeProduct.image}
              alt={activeProduct.name}
              className="w-32 mx-auto mb-3"
            />
            <p>{activeProduct.name} has been added to your cart.</p>
            <button
              onClick={() => setModalVisible(false)}
              className="mt-4 bg-black text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideTable;
