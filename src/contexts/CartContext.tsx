import React, { createContext, useState, useContext, useEffect } from "react";
import { useNotifications } from "./NotificationContext";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  discount?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
  getDiscountedPrice: (price: number, discount?: number) => number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  totalPrice: 0,
  getDiscountedPrice: () => 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { addNotification } = useNotifications();

  // Carregar itens do localStorage ao montar o componente
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem("cartItems");
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
    } catch (error) {
      console.error("Erro ao carregar itens do carrinho:", error);
    }
  }, []);

  // Salvar itens no localStorage quando atualizar
  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(items));
    } catch (error) {
      console.error("Erro ao salvar itens do carrinho:", error);
    }
  }, [items]);

  // Calcular preço com desconto
  const getDiscountedPrice = (price: number, discount?: number): number => {
    if (!discount) return price;
    return price * (1 - discount / 100);
  };

  // Adicionar item ao carrinho
  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      // Verificar se o item já existe no carrinho
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);

      if (existingItemIndex >= 0) {
        // Se existir, incrementa a quantidade
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };

        addNotification({
          message: `Quantidade de ${item.name} atualizada no carrinho`,
          severity: "success",
        });

        return updatedItems;
      } else {
        // Se não existir, adiciona como novo item
        addNotification({
          message: `${item.name} adicionado ao carrinho`,
          severity: "success",
        });

        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  // Remover item do carrinho
  const removeItem = (id: number) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === id);

      if (itemToRemove) {
        addNotification({
          message: `${itemToRemove.name} removido do carrinho`,
          severity: "info",
        });
      }

      return prevItems.filter((item) => item.id !== id);
    });
  };

  // Atualizar quantidade de um item
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Limpar o carrinho
  const clearCart = () => {
    setItems([]);
    addNotification({
      message: "Carrinho esvaziado",
      severity: "info",
    });
  };

  // Calcular número total de itens no carrinho
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  // Calcular preço total do carrinho (com descontos aplicados)
  const totalPrice = items.reduce(
    (total, item) =>
      total + getDiscountedPrice(item.price, item.discount) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        totalPrice,
        getDiscountedPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
