import React, { useEffect, useRef, useState } from "react";
import HeroSection from "../../Component/HeroSection";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const homeRef = useRef(null); // Ref to scroll to the Home section
  const blogsRef = useRef([]); // Ref for blog cards animation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/guest/allblogs");
        const data = await response.json();
        console.log("Fetched data:", data);

        if (data.success) {
          setBlogs(data.Blogs);
          setAuthors(data.Authors);
        } else {
          setError(data.message || "Failed to fetch data.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // GSAP Scroll Animation for Blog Cards
  useEffect(() => {
    if (blogs.length > 0) {
      gsap.fromTo(
        blogsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: homeRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, [blogs]);

  // Function to handle search input changes
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter blogs based on the search query
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Smooth scroll to blog section
  const scrollToHome = () => {
    gsap.to(window, {
      duration: 1,
      scrollTo: homeRef.current,
      ease: "power2.out",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-lg text-gray-700">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100 text-lg text-red-500">
        Something went wrong. Please try again later.
      </div>
    );
  }

  return (
    <>
      <HeroSection scrollToHome={scrollToHome} />

      {/* Search Input */}
      <div className="relative p-6 text-center bg-white shadow-md text-black">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-2/3 sm:w-1/2 p-3 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
        />
        <FaSearch className="absolute right-[370px] top-10 text-1xl" />
      </div>

      <section ref={homeRef} className="py-20 p-20 bg-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          All Blogs
        </h1>

        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog, index) => (
              <div
                key={blog._id}
                ref={(el) => (blogsRef.current[index] = el)}
                className="overflow-hidden rounded bg-white text-slate-500 shadow-md shadow-slate-200"
              >
                <figure className="relative">
                  {/* Display the image */}
                  {blog.images && blog.images[0] ? (
                    <img
                      src={`http://localhost:4000${blog.images[0]}`}
                      alt={blog.title}
                      className="aspect-video w-full"
                    />
                  ) : (
                    <div className="h-48 w-full bg-gray-200 flex justify-center items-center">
                      No image available
                    </div>
                  )}
                  {/* Display the category text */}
                  {blog.category && (
                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs">
                      {blog.category}
                    </div>
                  )}
                </figure>

                <div className="p-6">
                  <header className="mb-4 flex gap-4">
                    <div>
                      <h3 className="text-xl font-medium text-slate-700">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-slate-400">
                        By{" "}
                        {authors.find((author) => author.blogId === blog._id)
                          ?.userName || "Unknown"}
                      </p>
                    </div>
                  </header>
                  <p>{blog.content || "No content available"}</p>
                  <Link
                    to={`/fullblog/${blog._id}`}
                    state={{ indvdata: blog }}
                  >
                    <button className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Read More
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg">
            No blogs found for "{searchQuery}".
          </div>
        )}
      </section>
    </>
  );
};

export default Home;
