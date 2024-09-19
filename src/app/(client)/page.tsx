import React from "react";
import Header from "./_components/header";
import Hero from "./_components/hero";
import SpecialProducts from "./_components/specialProducts";
import About from "./_components/about";
import Products from "./_components/products";
import NewsLetter from "./_components/newsletter";
import Footer from "./_components/footer";
//import { SessionProvider } from "next-auth/react";

const HomePage = () => {
  return (
    <>
      <Header />
      <Hero />
      <SpecialProducts />
      <About />
      <Products />
      <NewsLetter />
      <Footer />
    </>
  );
};

export default HomePage;
