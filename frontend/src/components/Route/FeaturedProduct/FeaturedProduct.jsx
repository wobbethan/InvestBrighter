import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProductsAdmin,
  getAllProductsEvent,
} from "../../../redux/actions/product";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";

const FeaturedProduct = () => {
  const { allProducts, allProductsAdmin, allProductsEvent } = useSelector(
    (state) => state.products
  );
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        dispatch(getAllProductsAdmin(user?._id));
      } else {
        dispatch(getAllProductsEvent(user?.section));
      }
    }
  }, [isAuthenticated]);
  return (
    <>
      {!isAuthenticated && (
        <div>
          <div className={`${styles.section}`}>
            {allProducts && allProducts.length !== 0 && (
              <div className={`${styles.heading}`}>
                <h1>Available Companies</h1>
              </div>
            )}
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl-gap-[30px] mb-12 border-0">
              {allProducts && allProducts.length !== 0 && (
                <>
                  {allProducts &&
                    allProducts.map((i, index) => (
                      <ProductCard data={i} key={index} />
                    ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {user?.role === "admin" && (
        <div>
          <div className={`${styles.section}`}>
            {allProductsAdmin && allProductsAdmin.length !== 0 && (
              <div className={`${styles.heading}`}>
                <h1>Available Companies</h1>
              </div>
            )}
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl-gap-[30px] mb-12 border-0">
              {allProductsAdmin && allProductsAdmin.length !== 0 && (
                <>
                  {allProductsAdmin &&
                    allProductsAdmin.map((i, index) => (
                      <ProductCard data={i} key={index} />
                    ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {user?.role === "user" && (
        <div>
          <div className={`${styles.section}`}>
            {allProductsEvent && allProductsEvent.length !== 0 && (
              <div className={`${styles.heading}`}>
                <h1>Available Companies</h1>
              </div>
            )}
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl-gap-[30px] mb-12 border-0">
              {allProductsEvent && allProductsEvent.length !== 0 && (
                <>
                  {allProductsEvent &&
                    allProductsEvent.map((i, index) => (
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
