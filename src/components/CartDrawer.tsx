import React from "react";
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
  Divider,
  Button,
  TextField,
  Badge,
  useTheme,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  Close,
  Delete,
  Add,
  Remove,
  ShoppingCart,
  ShoppingBag,
} from "@mui/icons-material";
import { useCart, CartItem } from "../contexts/CartContext";
import ProductImage from "./ProductImage";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice,
    getDiscountedPrice,
  } = useCart();

  // Formatar preço em moeda brasileira
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Renderizar um item do carrinho
  const renderCartItem = (item: CartItem) => {
    const itemTotalPrice =
      getDiscountedPrice(item.price, item.discount) * item.quantity;

    return (
      <ListItem key={item.id} divider sx={{ py: 2 }}>
        <ListItemAvatar>
          <Box
            sx={{
              width: 60,
              height: 60,
              mr: 1,
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <ProductImage
              productName={item.name}
              height={60}
              width={60}
              sx={{ borderRadius: 0 }}
            />
          </Box>
        </ListItemAvatar>

        <ListItemText
          primary={item.name}
          secondary={
            <>
              <Typography
                variant="body2"
                component="span"
                sx={{ display: "block" }}
              >
                {item.discount ? (
                  <>
                    <Typography
                      component="span"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        mr: 1,
                      }}
                    >
                      {formatCurrency(item.price)}
                    </Typography>
                    {formatCurrency(
                      getDiscountedPrice(item.price, item.discount)
                    )}
                  </>
                ) : (
                  formatCurrency(item.price)
                )}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  sx={{
                    p: 0.5,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                  }}
                >
                  <Remove fontSize="small" />
                </IconButton>
                <TextField
                  variant="outlined"
                  size="small"
                  value={item.quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      updateQuantity(item.id, value);
                    }
                  }}
                  inputProps={{
                    min: 1,
                    style: {
                      textAlign: "center",
                      padding: "4px",
                      width: "30px",
                    },
                  }}
                  sx={{ mx: 1 }}
                />
                <IconButton
                  size="small"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  sx={{
                    p: 0.5,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                  }}
                >
                  <Add fontSize="small" />
                </IconButton>
              </Box>
            </>
          }
          sx={{ ml: 1 }}
        />

        <ListItemSecondaryAction>
          <Stack spacing={1} alignItems="flex-end">
            <Typography variant="subtitle2" color="primary.main">
              {formatCurrency(itemTotalPrice)}
            </Typography>
            <Tooltip title="Remover item">
              <IconButton
                edge="end"
                onClick={() => removeItem(item.id)}
                color="error"
                size="small"
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 400 },
          p: 0,
          borderTopLeftRadius: { xs: 0, sm: 16 },
          borderBottomLeftRadius: { xs: 0, sm: 16 },
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ShoppingCart sx={{ mr: 1 }} />
            Carrinho de Compras
          </Box>
        </Typography>
        <IconButton onClick={onClose} size="large">
          <Close />
        </IconButton>
      </Box>

      <Divider />

      {items.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 5,
            height: "50vh",
          }}
        >
          <ShoppingBag sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" align="center">
            Seu carrinho está vazio
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 1 }}
          >
            Adicione produtos para continuar
          </Typography>
          <Button variant="contained" onClick={onClose} sx={{ mt: 3 }}>
            Continuar Comprando
          </Button>
        </Box>
      ) : (
        <>
          <List sx={{ flex: 1, overflowY: "auto", p: 0 }}>
            {items.map(renderCartItem)}
          </List>

          <Box sx={{ p: 2, bgcolor: "background.default" }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Subtotal
              </Typography>
              <Typography variant="body2">
                {formatCurrency(totalPrice)}
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="body2" color="text.secondary">
                Frete
              </Typography>
              <Typography variant="body2">{formatCurrency(0)}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Total
              </Typography>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="primary.main"
              >
                {formatCurrency(totalPrice)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={clearCart}
                color="inherit"
              >
                Limpar
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  onClose();
                  // Aqui poderia redirecionar para o checkout
                }}
              >
                Finalizar Compra
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default CartDrawer;
