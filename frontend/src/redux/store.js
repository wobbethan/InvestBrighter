import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import { sellerReducer } from "./reducers/seller";
import { productReducer } from "./reducers/product";
import { eventReducer } from "./reducers/event";
import { cartReducer } from "./reducers/cart";
import { orderReducer } from "./reducers/order";
import { wishlistReducer } from "./reducers/wishlist";
import { sectionReducer } from "./reducers/section";

const Store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    products: productReducer,
    events: eventReducer,
    cart: cartReducer,
    order: orderReducer,
    wishlist: wishlistReducer,
    sections: sectionReducer,
  },
});

export default Store;
