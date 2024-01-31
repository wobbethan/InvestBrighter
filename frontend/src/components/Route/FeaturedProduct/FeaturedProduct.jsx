import React, { useEffect, useState } from "react";
import styles from "../../../styles/styles";
import { productData } from "../../../static/data";
import ProductCard from "../ProductCard/ProductCard";
import { useSelector } from "react-redux";

const FeaturedProduct = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    setData(allProducts);
  }, [allProducts]);
  return (
    <>
      {allProducts?.length !== 0 && (
        <div>
          <div className={`${styles.section}`}>
            <div className={`${styles.heading}`}>
              <h1>Available Companies</h1>
            </div>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl-gap-[30px] mb-12 border-0">
              {data && data.length !== 0 && (
                <>
                  {data &&
                    data.map((i, index) => (
                      <ProductCard data={i} key={index} />
                    ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedProduct;
