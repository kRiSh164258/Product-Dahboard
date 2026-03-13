import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  const res = await axios.get("https://dummyjson.com/products?limit=100");
  return res.data.products;
});

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], loading: false, error: null },
  reducers: {
    addProduct: (state, { payload }) => {
      state.items.unshift({ ...payload, id: Date.now() });
    },
    updateProduct: (state, { payload }) => {
      const i = state.items.findIndex((p) => p.id === payload.id);
      if (i !== -1) state.items[i] = payload;
    },
    deleteProduct: (state, { payload }) => {
      state.items = state.items.filter((p) => p.id !== payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload;
      })
      .addCase(fetchProducts.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { addProduct, updateProduct, deleteProduct } =
  productsSlice.actions;
export default productsSlice.reducer;
