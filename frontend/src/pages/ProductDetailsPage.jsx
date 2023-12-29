import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductDetails from "../components/products/ProductDetails.jsx";
import { useParams } from "react-router";
import { productData } from "../static/data.js";
import { useEffect, useState } from "react";
import SuggestedProduct from "../components/products/SuggestedProduct.jsx";
const ProductDetailsPage = () => {
  const { name } = useParams();
  const [data, setData] = useState(null);
  const productName = name.replace(/-/g, " ");
  useEffect(() => {
    const data = productData.find((i) => i.name === productName);
    setData(data);
  }, []);
  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {data && <SuggestedProduct data={data} />}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
