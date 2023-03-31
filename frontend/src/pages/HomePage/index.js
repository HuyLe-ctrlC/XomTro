import React from "react";
import Footer from "../../components/Footer";
import Feature from "./Body/Feature";
import Post from "./Body/Post";
import Header from "./Header";
const HomePage = () => {
  return (
    <>
      <div className="pb-10 bg-blue-50">
        <header className="w-full bg-header">
          <Header />
        </header>
        <section className="w-full">
          <Feature />
          <Post />
        </section>

        <div className="relative max-w-7xl mx-auto px-4">
          <hr className="border-gray-600" />
          <footer>
            <Footer />
          </footer>
        </div>
      </div>
    </>
  );
};

export default HomePage;
