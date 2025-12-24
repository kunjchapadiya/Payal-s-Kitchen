import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
          toast.info(`Increased quantity of ${product.title || product.name}`);
        } else {
          set({
            cart: [...cart, { ...product, quantity: 1 }],
          });
          toast.success(`${product.title || product.name} added to cart`);
        }
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        }));
        toast.error("Item removed from cart");
      },

      updateQuantity: (productId, newQuantity) => {
        if (newQuantity < 1) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
        toast.info("Cart cleared");
      },

      // Getters can be derived in the component, but we can also have helper functions
      getCartSubTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getDeliveryFee: (subtotal) => {
        return subtotal > 200 ? 0 : 40;
      },

      getGrandTotal: () => {
        const subtotal = get().getCartSubTotal();
        const delivery = get().getDeliveryFee(subtotal);
        return subtotal + delivery;
      },
    }),
    {
      name: "cart-storage", // name of the item in the storage (must be unique)
    }
  )
);

export default useCartStore;
