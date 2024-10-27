import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import AOS from "aos";
import { toast, ToastContainer } from "react-toastify";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import {
  FaTruck,
  FaMoneyBillAlt,
  FaUndo,
  FaBusinessTime,
  FaChevronDown,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import image11 from "../../assets/Lifestyle/MercuryPlanter/mplanter.png";
import image12 from "../../assets/Lifestyle/MercuryPlanter/mplanter2.jpg";
import image13 from "../../assets/Lifestyle/MercuryPlanter/mplanter3.jpg";
import image14 from "../../assets/Lifestyle/MercuryPlanter/mplanter4.jpeg";

import image21 from "../../assets/Lifestyle/MercuryCone/mcone1.jpeg";
import image22 from "../../assets/Lifestyle/MercuryCone/mcone2.jpg";
import image23 from "../../assets/Lifestyle/MercuryCone/mcone3.jpeg";
import image24 from "../../assets/Lifestyle/MercuryCone/mcone4.jpg";

import image15 from "../../assets/Mercury/mc11.jpg";
import image25 from "../../assets/Mercury/mc22.jpg";

import imageM1 from "../../assets/Front/mercuryvase.jpg";
import imageM2 from "../../assets//Front/mercuryplanter.jpg";

// Updated product images object with matching keys
const productImages = {
  "mercury-planter-planter": [
    imageM1,
    image11,
    image12,
    image13,
    image14,
    image15,
  ],
  "mercury-cone-vase": [imageM2, image21, image22, image23, image24, image25],
};

const products = [
  {
    id: "mercury-planter-planter",
    name: "MERCURY PLANTER",
    description: [
      "The heavily textured, hammered surface is inspired by the rugged highlands, cratered terrain, and lava flows of the planet Mercury",
      "Creating a striking resemblance to the celestial body’s unique surface.",
      "The shiny silver finish pays homage to Mercury’s silvery-white liquid metal droplets, adding a touch of celestial charm to your living space",
    ],
    price: 5000,
    imageUrl: "QmT1Gor1Jnd4iboHThSED2fQwQj2QU9giPqxPM5rMo2HvD",
    material: "Aluminium Sheet",
    dimensions: "10x10x13.75 Inch",
  },
  {
    id: "mercury-cone-vase",
    name: "MERCURY VASE",
    description: [
      "Enhances both garden spaces and living rooms",
      "Ideal for outdoor settings and elegant beside the sofa",
      "Crafted from durable mild steel with cement-like textured finish",
      "Features a sustainable jute rope handle",
      "Stylish and built to last",
    ],
    price: 3200,
    imageUrl: "Qmbz18bjynXio9XTwTaNmkrTZP4tb9x5xufk7BMzsxdQiT",
    material: "Aluminium Sheet",
    dimensions: "6.5x6.5x15 Inch",
  },
];

const PlantersAndVasesDesc = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [activeProduct, setActiveProduct] = useState(
    () => products.find((product) => product.id === productId) || products[0]
  );
  const [activeImg, setActiveImage] = useState(
    productImages[activeProduct.id] ? productImages[activeProduct.id][0] : ""
  );
  const [amount, setAmount] = useState(1);
  const [showDescription, setShowDescription] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  const [showCareInstructions, setShowCareInstructions] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [error, setError] = useState("");

  const [showPopup, setShowPopup] = useState(false); // State to manage the popup visibility
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  useEffect(() => {
    if (productImages[activeProduct.id]) {
      setActiveImage(productImages[activeProduct.id][0]);
    }
  }, [activeProduct]);

  const fetchUserData = async () => {
    console.log(userInfo);
    try {
      const response = await fetch(
        `https://qdore-backend-final-final-last.vercel.app/api/users/objectIdexport?fbUserId=${userInfo.fbUserId}`, // Assuming this retrieves MongoDB user
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

      const data = await response.json(); // This should return MongoDB user data
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Error fetching user data: " + error.message);
      return null;
    }
  };
  const handleAddToCart = async () => {
    if (userInfo) {
      // User is logged in, save to database
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
              productId: activeProduct.id,
              name: activeProduct.name,
              price: Number(activeProduct.price),
              image: activeProduct.imageUrl,
              quantity: amount,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add to cart");
        }

        // Show success toast and popup
        toast.success("Product added to cart!");
        setPopupMessage("Product added to cart!");
        setShowPopup(true);

        // Hide the popup after 3 seconds
        setTimeout(() => {
          setShowPopup(false);
        }, 3000); // 3000 ms = 3 seconds
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("An unexpected error occurred. Please try again later.");
      }
    } else {
      // User is not logged in, save to local storage
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const existingItemIndex = cartItems.findIndex(
        (item) => item.productId === activeProduct.id
      );

      if (existingItemIndex !== -1) {
        // If the item already exists, update its quantity
        cartItems[existingItemIndex].quantity += amount;
      } else {
        // If it's a new item, add it to the cart
        cartItems.push({
          productId: activeProduct.id,
          name: activeProduct.name,
          price: Number(activeProduct.price),
          image: activeProduct.imageUrl,
          quantity: amount,
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      // Show success toast and popup
      toast.success("Product added to cart!");
      setPopupMessage("Product added to cart!");
      setShowPopup(true);

      // Hide the popup after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  };

  const handleBuyNow = () => {
    if (!userInfo) {
      // Save current product to localStorage before redirecting
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      cartItems.push({
        productId: activeProduct.id,
        name: activeProduct.name,
        price: Number(activeProduct.price),
        image: activeProduct.imageUrl,
        quantity: amount,
      });
      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      // Redirect to /auth if not logged in
      navigate("/auth", { state: { redirectTo: location.pathname } });
      return;
    }

    // If user is logged in, proceed with the existing logic
    const userId = userInfo?._id;

    if (!userId) {
      console.error("User ID is missing");
      alert("Please log in to purchase items.");
      return;
    }

    // Create an order object
    const orderData = {
      userId: userId,
      products: [
        {
          productId: activeProduct.id,
          name: activeProduct.name,
          quantity: amount,
          price: Number(activeProduct.price),
          image: activeProduct.imageUrl,
        },
      ],
      totalAmount: (Number(activeProduct.price) * amount).toFixed(2),
    };

    // Redirect to the Address Selection page with the order data
    navigate("/select-address", {
      state: { orderData },
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row items-start justify-center">
          {/* Main Image and Thumbnails */}
          <div className="flex flex-col lg:flex-row lg:gap-3 lg:w-1/2">
            {/* Main Image */}
            <div className="flex-shrink-0 lg:w-2/3">
              <img
                src={activeImg}
                alt="Main Product"
                className="w-full h-full object-cover rounded-lg shadow-lg"
                style={{ maxHeight: "600px" }}
              />
            </div>
            {/* Thumbnail Images */}
            <div className="flex flex-row lg:flex-col lg:w-1/3 lg:mt-0 mt-4 justify-between">
              <div className="grid grid-cols-5 gap-2 lg:grid-cols-1 lg:gap-3">
                {productImages[activeProduct.id] &&
                  productImages[activeProduct.id].map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-20 h-20 lg:w-1/3 lg:h-auto rounded-lg cursor-pointer hover:opacity-75"
                      onClick={() => {
                        setActiveImage(img);
                        setActiveImageIndex(index); // Set the active image index
                      }}
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* productImages[activeProduct.id].map((img, index) */}

          {/* Product Details Section */}
          <div className="lg:w-1/2 flex flex-col lg:pl-8 lg:gap-6 mt-6 lg:mt-0">
            <h1 className="text-5xl lg:text-8xl font-bold text-black mb-4 ">
              {activeProduct.name}
            </h1>
            <ul className="text-gray-700 text-2xl list- ">
              {activeProduct.description.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>

            <h2 className="text-4xl font-semibold my-4">
              ₹{activeProduct.price.toFixed(2)}
            </h2>

            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <button
                  className="bg-gray-200 py-2 px-4 rounded-lg text-lg"
                  onClick={() => setAmount(Math.max(1, amount - 1))}
                >
                  -
                </button>
                <span className="py-2 px-4 text-lg">{amount}</span>
                <button
                  className="bg-gray-200 py-2 px-4 rounded-lg text-lg"
                  onClick={() => setAmount(amount + 1)}
                >
                  +
                </button>
              </div>

              {/* Add to Cart & Buy Now */}
              <button
                onClick={handleAddToCart}
                className="bg-black text-white py-2 px-6 rounded-xl"
              >
                Add to Cart
              </button>
              {showPopup && (
                <div className="popup fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg transition duration-300">
                  {popupMessage}
                </div>
              )}
              <button
                onClick={handleBuyNow}
                className="bg-black text-white py-2 px-6 rounded-xl"
              >
                Buy Now
              </button>
            </div>

            {/* Features Section */}
            <div className="flex justify-between py-6 mt-4 bg-gray-100 rounded-lg">
              <div className="flex items-center space-x-5">
                <IconFeature icon={<FaTruck />} text="Free Delivery" />
                <IconFeature
                  icon={<FaMoneyBillAlt />}
                  text="Cash on Delivery"
                />
                <IconFeature icon={<FaUndo />} text="7 Days Return" />
                <IconFeature icon={<FaBusinessTime />} text="Quick Dispatch" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row  mt-8">
          <div className="lg:w-2/3">
            <div className="border-2 border-gray-300 rounded-lg p-1 mb-4">
              <CollapsibleSection
                title="Description"
                isOpen={showDescription}
                toggle={() => setShowDescription(!showDescription)}
              >
                <ul className="text-gray-700 text-sm list-disc list-inside">
                  {activeProduct.description.map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </ul>
              </CollapsibleSection>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-1 mb-4">
              <CollapsibleSection
                title="Dimensions & Material"
                isOpen={showDimensions}
                toggle={() => setShowDimensions(!showDimensions)}
              >
                <p className="text-gray-700 text-sm ">
                  Dimensions: {activeProduct.dimensions}
                </p>
                <p className="text-gray-700 text-sm">
                  Material: {activeProduct.material}
                </p>
              </CollapsibleSection>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-1 mb-4">
              <CollapsibleSection
                title="Care Instructions"
                isOpen={showCareInstructions}
                toggle={() => setShowCareInstructions(!showCareInstructions)}
              >
                <p className="text-gray-700 text-sm">Clean with a dry cloth.</p>
              </CollapsibleSection>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-1 mb-4">
              <CollapsibleSection
                title="Shipping & Returns"
                isOpen={showShipping}
                toggle={() => setShowShipping(!showShipping)}
              >
                <p className="text-gray-700 text-sm">
                  Free shipping available. Returns accepted within 7 days.
                </p>
              </CollapsibleSection>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

// Collapsible Section Component
const CollapsibleSection = ({ title, isOpen, toggle, children }) => (
  <div className="my-4">
    <div
      className="flex items-center justify-between cursor-pointer"
      onClick={toggle}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <FaChevronDown className={isOpen ? "transform rotate-180" : ""} />
    </div>
    {isOpen && <div className="mt-2">{children}</div>}
  </div>
);

// IconFeature Component
const IconFeature = ({ icon, text }) => (
  <div className="flex flex-col items-center p-0 m-0 space-y-1">
    {" "}
    {/* Space between icon and text */}
    <div className="text-xl">{icon}</div>
    <span className="text-sm text-gray-700">{text}</span>
  </div>
);

export default PlantersAndVasesDesc;