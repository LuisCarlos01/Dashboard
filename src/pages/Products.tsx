import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Rating,
  Fade,
  Paper,
  Menu,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Badge,
  Skeleton,
  useTheme,
  Divider,
  Stack,
  Alert,
  Snackbar,
  ListItemIcon,
  CircularProgress,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Search,
  FilterList,
  AddCircleOutline,
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  MoreVert,
  Sort,
  Edit,
  ContentCopy,
  Delete,
  Visibility,
  LocalShipping,
  Inventory,
  ShowChart,
  Done,
  Close,
  ShoppingBag,
  ArrowDownward,
  ArrowUpward,
  StarOutline,
  Star,
  ViewList,
  ViewModule,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import ProductImage from "../components/ProductImage";
import { useCart } from "../contexts/CartContext";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  stock: number;
  featured: boolean;
  sales?: number;
  discount?: number;
  sku?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Categorias ampliadas
const categories = [
  "Eletrônicos",
  "Informática",
  "Áudio",
  "Fotografia",
  "Smartphones",
  "Acessórios",
  "Games",
  "Casa Inteligente",
];

// Produtos mockados ampliados
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Smartphone X",
    description:
      "Smartphone de última geração com câmera de alta resolução e processador rápido",
    price: 1299.99,
    image: "https://via.placeholder.com/300x200?text=Smartphone+X",
    category: "Eletrônicos",
    rating: 4.5,
    stock: 23,
    featured: true,
    sales: 143,
    discount: 10,
    sku: "SP-X001",
    createdAt: "2023-10-15",
    updatedAt: "2024-03-20",
  },
  {
    id: 2,
    name: "Notebook Pro",
    description:
      "Notebook profissional com desempenho excepcional para tarefas exigentes",
    price: 3999.99,
    image: "https://via.placeholder.com/300x200?text=Notebook+Pro",
    category: "Informática",
    rating: 4.8,
    stock: 15,
    featured: true,
    sales: 87,
    discount: 5,
    sku: "NB-P002",
    createdAt: "2023-09-05",
    updatedAt: "2024-02-10",
  },
  {
    id: 3,
    name: "Headphone BT",
    description:
      "Fone de ouvido bluetooth com qualidade de áudio premium e cancelamento de ruído",
    price: 299.99,
    image: "https://via.placeholder.com/300x200?text=Headphone+BT",
    category: "Áudio",
    rating: 4.2,
    stock: 42,
    featured: false,
    sales: 215,
    sku: "HP-BT003",
    createdAt: "2023-11-20",
    updatedAt: "2024-01-05",
  },
  {
    id: 4,
    name: 'Smart TV 55"',
    description: "Smart TV com resolução 4K, HDR e recursos inteligentes",
    price: 2799.99,
    image: "https://via.placeholder.com/300x200?text=Smart+TV+55",
    category: "Eletrônicos",
    rating: 4.6,
    stock: 8,
    featured: true,
    sales: 63,
    discount: 15,
    sku: "TV-55004",
    createdAt: "2023-08-12",
    updatedAt: "2024-03-15",
  },
  {
    id: 5,
    name: "Tablet Air",
    description:
      "Tablet leve e portátil com tela de alta resolução e desempenho excepcional",
    price: 899.99,
    image: "https://via.placeholder.com/300x200?text=Tablet+Air",
    category: "Informática",
    rating: 4.3,
    stock: 19,
    featured: false,
    sales: 98,
    sku: "TB-A005",
    createdAt: "2023-10-30",
    updatedAt: "2024-02-28",
  },
  {
    id: 6,
    name: "Câmera DSLR",
    description:
      "Câmera profissional com sensor de alta resolução e recursos avançados",
    price: 1899.99,
    image: "https://via.placeholder.com/300x200?text=Camera+DSLR",
    category: "Fotografia",
    rating: 4.7,
    stock: 6,
    featured: true,
    sales: 42,
    discount: 8,
    sku: "CM-D006",
    createdAt: "2023-07-25",
    updatedAt: "2024-01-18",
  },
  {
    id: 7,
    name: "Mouse Gamer RGB",
    description:
      "Mouse para jogos com sensor preciso e iluminação RGB personalizável",
    price: 199.99,
    image: "https://via.placeholder.com/300x200?text=Mouse+Gamer",
    category: "Informática",
    rating: 4.4,
    stock: 31,
    featured: false,
    sales: 157,
    sku: "MS-G007",
    createdAt: "2023-12-10",
    updatedAt: "2024-03-05",
  },
  {
    id: 8,
    name: "Smartwatch Pro",
    description:
      "Relógio inteligente com monitoramento de saúde e notificações",
    price: 499.99,
    image: "https://via.placeholder.com/300x200?text=Smartwatch",
    category: "Eletrônicos",
    rating: 4.1,
    stock: 27,
    featured: false,
    sales: 110,
    discount: 12,
    sku: "SW-P008",
    createdAt: "2023-11-05",
    updatedAt: "2024-02-15",
  },
  {
    id: 9,
    name: "Echo Dot",
    description:
      "Alto-falante inteligente com assistente virtual para sua casa",
    price: 349.99,
    image: "https://via.placeholder.com/300x200?text=Echo+Dot",
    category: "Casa Inteligente",
    rating: 4.5,
    stock: 38,
    featured: true,
    sales: 203,
    sku: "ED-009",
    createdAt: "2023-08-18",
    updatedAt: "2024-03-10",
  },
  {
    id: 10,
    name: "Console XYZ",
    description:
      "Console de jogos de última geração com gráficos impressionantes",
    price: 3499.99,
    image: "https://via.placeholder.com/300x200?text=Console+XYZ",
    category: "Games",
    rating: 4.9,
    stock: 5,
    featured: true,
    sales: 78,
    discount: 5,
    sku: "CX-010",
    createdAt: "2023-09-22",
    updatedAt: "2024-02-20",
  },
  {
    id: 11,
    name: "Impressora Laser",
    description:
      "Impressora rápida e econômica para uso doméstico ou em pequenos escritórios",
    price: 699.99,
    image: "https://via.placeholder.com/300x200?text=Impressora",
    category: "Informática",
    rating: 4.0,
    stock: 13,
    featured: false,
    sales: 54,
    sku: "IL-011",
    createdAt: "2023-10-05",
    updatedAt: "2024-01-10",
  },
  {
    id: 12,
    name: "Teclado Mecânico",
    description: "Teclado mecânico com switches premium e retroiluminação RGB",
    price: 279.99,
    image: "https://via.placeholder.com/300x200?text=Teclado",
    category: "Informática",
    rating: 4.6,
    stock: 24,
    featured: false,
    sales: 128,
    discount: 7,
    sku: "TM-012",
    createdAt: "2023-11-15",
    updatedAt: "2024-03-02",
  },
];

const Products = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuProductId, setMenuProductId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<
    "delete" | "edit" | "add" | "view"
  >("view");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Estado para feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const { addItem } = useCart();

  // Efeito de loading para operações de filtro
  useEffect(() => {
    if (category !== "" || showOnlyFeatured) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [category, showOnlyFeatured]);

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  const handleSortByChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    productId: number
  ) => {
    setMenuProductId(productId);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleFavorite = (
    productId: number,
    event?: React.MouseEvent
  ) => {
    if (event) {
      event.stopPropagation();
    }

    if (favorites.includes(productId)) {
      setFavorites(favorites.filter((id) => id !== productId));
      showSnackbar("Produto removido dos favoritos", "info");
    } else {
      setFavorites([...favorites, productId]);
      showSnackbar("Produto adicionado aos favoritos", "success");
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    if (newValue === 0) {
      setShowOnlyFeatured(false);
      setCategory("");
    } else if (newValue === 1) {
      setShowOnlyFeatured(true);
      setCategory("");
    } else if (newValue === 2) {
      setShowOnlyFeatured(false);
      setCategory("Eletrônicos");
    } else if (newValue === 3) {
      setShowOnlyFeatured(false);
      setCategory("Informática");
    }
  };

  const handleOpenDialog = (
    type: "delete" | "edit" | "add" | "view",
    product?: Product
  ) => {
    setDialogType(type);
    setSelectedProduct(product || null);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleAction = () => {
    if (!selectedProduct && dialogType !== "add") return;

    // Simular a ação com base no tipo de diálogo
    switch (dialogType) {
      case "delete":
        showSnackbar(
          `Produto "${selectedProduct?.name}" removido com sucesso`,
          "success"
        );
        break;
      case "edit":
        showSnackbar(
          `Produto "${selectedProduct?.name}" atualizado com sucesso`,
          "success"
        );
        break;
      case "add":
        showSnackbar("Novo produto adicionado com sucesso", "success");
        break;
    }

    setOpenDialog(false);
  };

  // Adicionar ao carrinho
  const handleAddToCart = (product: Product, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      discount: product.discount,
    });
  };

  // Aplicar filtros
  const filteredProducts = mockProducts
    .filter(
      (product) =>
        (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) &&
        (category === "" || product.category === category) &&
        (!showOnlyFeatured || product.featured)
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "price_asc") {
        return a.price - b.price;
      } else if (sortBy === "price_desc") {
        return b.price - a.price;
      } else if (sortBy === "rating") {
        return b.rating - a.rating;
      } else if (sortBy === "stock") {
        return b.stock - a.stock;
      } else if (sortBy === "sales") {
        return (b.sales || 0) - (a.sales || 0);
      }
      return 0;
    });

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const getStockColor = (stock: number) => {
    if (stock <= 5) return "error.main";
    if (stock <= 15) return "warning.main";
    return "success.main";
  };

  const getDiscountedPrice = (product: Product) => {
    if (!product.discount) return product.price;
    return product.price * (1 - product.discount / 100);
  };

  const renderGridItem = (product: Product) => (
    <Grid item xs={12} sm={6} md={4} key={product.id}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow:
              theme.palette.mode === "light"
                ? "0 4px 12px rgba(0,0,0,0.05)"
                : "0 4px 12px rgba(0,0,0,0.2)",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow:
                theme.palette.mode === "light"
                  ? "0 12px 24px rgba(0,0,0,0.1)"
                  : "0 12px 24px rgba(0,0,0,0.3)",
            },
          }}
          onClick={() => handleOpenDialog("view", product)}
        >
          {loading ? (
            <Skeleton variant="rectangular" height={200} animation="wave" />
          ) : (
            <Box sx={{ position: "relative" }}>
              <ProductImage productName={product.name} height={200} />

              {product.discount && (
                <Chip
                  label={`-${product.discount}%`}
                  color="error"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    fontWeight: "bold",
                  }}
                />
              )}

              {product.featured && (
                <Chip
                  icon={<Star fontSize="small" />}
                  label="Destaque"
                  color="secondary"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                  }}
                />
              )}

              <IconButton
                onClick={(e) => handleToggleFavorite(product.id, e)}
                sx={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  bgcolor: "background.paper",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  "&:hover": { bgcolor: "background.paper" },
                }}
                size="small"
              >
                {favorites.includes(product.id) ? (
                  <Favorite color="error" fontSize="small" />
                ) : (
                  <FavoriteBorder fontSize="small" />
                )}
              </IconButton>
            </Box>
          )}

          <CardContent sx={{ flexGrow: 1, pb: 1 }}>
            {loading ? (
              <>
                <Skeleton
                  animation="wave"
                  height={24}
                  width="80%"
                  sx={{ mb: 1 }}
                />
                <Skeleton animation="wave" height={16} width="60%" />
              </>
            ) : (
              <>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    height: 48,
                    overflow: "hidden",
                  }}
                >
                  {product.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Rating
                    value={product.rating}
                    precision={0.1}
                    readOnly
                    size="small"
                  />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({product.rating.toFixed(1)})
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1.5,
                    height: 40,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {product.description}
                </Typography>
              </>
            )}
          </CardContent>

          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {loading ? (
              <Skeleton animation="wave" height={32} width={100} />
            ) : (
              <Box>
                {product.discount ? (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                        display: "block",
                      }}
                    >
                      {formatCurrency(product.price)}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    >
                      {formatCurrency(getDiscountedPrice(product))}
                    </Typography>
                  </Box>
                ) : (
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {formatCurrency(product.price)}
                  </Typography>
                )}
              </Box>
            )}

            {loading ? (
              <Skeleton
                animation="wave"
                variant="circular"
                width={40}
                height={40}
              />
            ) : (
              <Tooltip title="Opções">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e, product.id);
                  }}
                >
                  <MoreVert />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Box
            sx={{
              px: 2,
              pb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Chip
              icon={<Inventory fontSize="small" />}
              label={`Estoque: ${product.stock}`}
              size="small"
              color={
                product.stock <= 5
                  ? "error"
                  : product.stock <= 15
                  ? "warning"
                  : "default"
              }
              variant="outlined"
            />

            <Button
              size="small"
              variant="outlined"
              startIcon={<ShoppingCart />}
              sx={{ borderRadius: 1.5 }}
              onClick={(e) => {
                handleAddToCart(product, e);
              }}
            >
              Comprar
            </Button>
          </Box>
        </Card>
      </motion.div>
    </Grid>
  );

  const renderListItem = (product: Product) => (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          boxShadow:
            theme.palette.mode === "light"
              ? "0 2px 8px rgba(0,0,0,0.05)"
              : "0 2px 8px rgba(0,0,0,0.2)",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow:
              theme.palette.mode === "light"
                ? "0 6px 16px rgba(0,0,0,0.1)"
                : "0 6px 16px rgba(0,0,0,0.3)",
          },
        }}
        onClick={() => handleOpenDialog("view", product)}
      >
        <Grid container>
          <Grid item xs={12} sm={3}>
            {loading ? (
              <Skeleton variant="rectangular" height={150} animation="wave" />
            ) : (
              <Box sx={{ position: "relative", height: "100%" }}>
                <ProductImage
                  productName={product.name}
                  height={150}
                  sx={{ height: "100%", borderRadius: 0 }}
                />

                {product.discount && (
                  <Chip
                    label={`-${product.discount}%`}
                    color="error"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      fontWeight: "bold",
                    }}
                  />
                )}

                {product.featured && (
                  <Chip
                    icon={<Star fontSize="small" />}
                    label="Destaque"
                    color="secondary"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                    }}
                  />
                )}
              </Box>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <CardContent>
              {loading ? (
                <>
                  <Skeleton
                    animation="wave"
                    height={24}
                    width="80%"
                    sx={{ mb: 1 }}
                  />
                  <Skeleton
                    animation="wave"
                    height={16}
                    width="60%"
                    sx={{ mb: 1 }}
                  />
                  <Skeleton animation="wave" height={16} width="90%" />
                </>
              ) : (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {product.name}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Rating
                      value={product.rating}
                      precision={0.1}
                      readOnly
                      size="small"
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({product.rating.toFixed(1)})
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {product.description.length > 120
                      ? `${product.description.substring(0, 120)}...`
                      : product.description}
                  </Typography>

                  <Box sx={{ display: "flex", mt: 2, gap: 1 }}>
                    <Chip
                      label={product.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      icon={<Inventory fontSize="small" />}
                      label={`Estoque: ${product.stock}`}
                      size="small"
                      color={
                        product.stock <= 5
                          ? "error"
                          : product.stock <= 15
                          ? "warning"
                          : "default"
                      }
                      variant="outlined"
                    />
                    {product.sales && (
                      <Chip
                        icon={<ShoppingBag fontSize="small" />}
                        label={`${product.sales} vendas`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </>
              )}
            </CardContent>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Box
              sx={{
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderLeft: `1px solid ${theme.palette.divider}`,
              }}
            >
              {loading ? (
                <>
                  <Skeleton animation="wave" height={32} width="80%" />
                  <Skeleton animation="wave" height={40} width="100%" />
                </>
              ) : (
                <>
                  <Box>
                    {product.discount ? (
                      <>
                        <Typography
                          variant="caption"
                          sx={{
                            textDecoration: "line-through",
                            color: "text.secondary",
                            display: "block",
                          }}
                        >
                          {formatCurrency(product.price)}
                        </Typography>
                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{ fontWeight: 600 }}
                        >
                          {formatCurrency(getDiscountedPrice(product))}
                        </Typography>
                      </>
                    ) : (
                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      >
                        {formatCurrency(product.price)}
                      </Typography>
                    )}

                    {product.sku && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 1 }}
                      >
                        SKU: {product.sku}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      fullWidth
                      onClick={(e) => {
                        handleAddToCart(product, e);
                      }}
                    >
                      Comprar
                    </Button>

                    <IconButton
                      onClick={(e) => handleToggleFavorite(product.id, e)}
                      color={
                        favorites.includes(product.id) ? "error" : "default"
                      }
                      sx={{ flexShrink: 0 }}
                    >
                      {favorites.includes(product.id) ? (
                        <Favorite />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </IconButton>

                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOpen(e, product.id);
                      }}
                      sx={{ flexShrink: 0 }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Card>
    </motion.div>
  );

  const renderProductDialog = () => {
    const dialogTitle = {
      delete: "Remover Produto",
      edit: "Editar Produto",
      add: "Adicionar Novo Produto",
      view: `Detalhes do Produto: ${selectedProduct?.name}`,
    }[dialogType];

    const dialogContent = {
      delete: (
        <DialogContentText>
          Tem certeza que deseja remover permanentemente o produto{" "}
          <strong>{selectedProduct?.name}</strong>? Esta ação não pode ser
          desfeita.
        </DialogContentText>
      ),
      view: selectedProduct && (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{ mb: 2 }}>
                <ProductImage
                  productName={selectedProduct.name}
                  height={250}
                  sx={{ borderRadius: 0 }}
                />
              </Card>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip
                  label={selectedProduct.category}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                {selectedProduct.featured && (
                  <Chip
                    icon={<Star fontSize="small" />}
                    label="Destaque"
                    size="small"
                    color="secondary"
                  />
                )}
              </Stack>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Rating
                  value={selectedProduct.rating}
                  precision={0.1}
                  readOnly
                  size="small"
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {selectedProduct.rating.toFixed(1)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {selectedProduct.name}
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedProduct.description}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">
                    Preço
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {selectedProduct.discount ? (
                      <>
                        <Typography
                          component="span"
                          sx={{
                            textDecoration: "line-through",
                            color: "text.secondary",
                            fontSize: "0.875rem",
                            mr: 1,
                          }}
                        >
                          {formatCurrency(selectedProduct.price)}
                        </Typography>
                        {formatCurrency(getDiscountedPrice(selectedProduct))}
                      </>
                    ) : (
                      formatCurrency(selectedProduct.price)
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">
                    Estoque
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: getStockColor(selectedProduct.stock),
                    }}
                  >
                    {selectedProduct.stock} unidades
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">
                    Vendas
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {selectedProduct.sales || 0} unidades
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">
                    SKU
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {selectedProduct.sku || "-"}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Data de Criação
                  </Typography>
                  <Typography variant="body2">
                    {selectedProduct.createdAt || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Última Atualização
                  </Typography>
                  <Typography variant="body2">
                    {selectedProduct.updatedAt || "-"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      ),
      edit: selectedProduct && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoFocus
              margin="dense"
              label="Nome do Produto"
              fullWidth
              defaultValue={selectedProduct.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Preço"
              type="number"
              fullWidth
              defaultValue={selectedProduct.price}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Descrição"
              fullWidth
              multiline
              rows={3}
              defaultValue={selectedProduct.description}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="URL da Imagem"
              fullWidth
              defaultValue={selectedProduct.image}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Categoria</InputLabel>
              <Select defaultValue={selectedProduct.category}>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              margin="dense"
              label="Estoque"
              type="number"
              fullWidth
              defaultValue={selectedProduct.stock}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              margin="dense"
              label="Avaliação"
              type="number"
              fullWidth
              defaultValue={selectedProduct.rating}
              InputProps={{
                inputProps: { min: 0, max: 5, step: 0.1 },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              margin="dense"
              label="Desconto (%)"
              type="number"
              fullWidth
              defaultValue={selectedProduct.discount || 0}
              InputProps={{
                inputProps: { min: 0, max: 100 },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="SKU"
              fullWidth
              defaultValue={selectedProduct.sku}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch checked={selectedProduct.featured} color="primary" />
              }
              label="Produto em destaque"
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>
      ),
      add: (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoFocus
              required
              margin="dense"
              label="Nome do Produto"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              margin="dense"
              label="Preço"
              type="number"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              margin="dense"
              label="Descrição"
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              margin="dense"
              label="URL da Imagem"
              fullWidth
              defaultValue="https://via.placeholder.com/300x200"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Categoria</InputLabel>
              <Select defaultValue="">
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              margin="dense"
              label="Estoque"
              type="number"
              fullWidth
              defaultValue={10}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              margin="dense"
              label="Avaliação"
              type="number"
              fullWidth
              defaultValue={4.0}
              InputProps={{
                inputProps: { min: 0, max: 5, step: 0.1 },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              margin="dense"
              label="Desconto (%)"
              type="number"
              fullWidth
              defaultValue={0}
              InputProps={{
                inputProps: { min: 0, max: 100 },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField margin="dense" label="SKU" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={<Switch color="primary" />}
              label="Produto em destaque"
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>
      ),
    }[dialogType];

    const actionButton = {
      delete: "Remover",
      edit: "Salvar",
      add: "Adicionar",
      view: "Fechar",
    }[dialogType];

    const actionIcon = {
      delete: <Delete />,
      edit: <Done />,
      add: <AddCircleOutline />,
      view: <Close />,
    }[dialogType];

    return (
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth={dialogType === "view" ? "md" : "sm"}
        fullWidth
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent dividers>{dialogContent}</DialogContent>
        <DialogActions>
          {dialogType !== "view" && (
            <Button onClick={handleCloseDialog} color="inherit">
              Cancelar
            </Button>
          )}
          <Button
            onClick={dialogType === "view" ? handleCloseDialog : handleAction}
            color={dialogType === "delete" ? "error" : "primary"}
            variant="contained"
            startIcon={actionIcon}
          >
            {actionButton}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Fade in={true} timeout={800}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            Produtos
          </Typography>
        </Fade>
        <Button
          variant="contained"
          startIcon={<AddCircleOutline />}
          sx={{ borderRadius: 2 }}
          onClick={() => handleOpenDialog("add")}
        >
          Adicionar Produto
        </Button>
      </Box>

      <Fade in={true} timeout={1000}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            mb: 3,
            boxShadow: "0 2px 10px 0 rgba(58, 123, 213, 0.1)",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Todos" />
            <Tab label="Destaques" />
            <Tab label="Eletrônicos" />
            <Tab label="Informática" />
          </Tabs>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <TextField
              placeholder="Buscar produtos..."
              variant="outlined"
              size="small"
              sx={{ width: { xs: "100%", sm: 300 } }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="category-select-label">Categoria</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={category}
                  label="Categoria"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="">Todas</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel id="sort-select-label">Ordenar por</InputLabel>
                <Select
                  labelId="sort-select-label"
                  id="sort-select"
                  value={sortBy}
                  label="Ordenar por"
                  onChange={handleSortByChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <Sort fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="name">Nome</MenuItem>
                  <MenuItem value="price_asc">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Preço <ArrowUpward sx={{ fontSize: 16, ml: 0.5 }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="price_desc">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Preço <ArrowDownward sx={{ fontSize: 16, ml: 0.5 }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="rating">Avaliação</MenuItem>
                  <MenuItem value="stock">Estoque</MenuItem>
                  <MenuItem value="sales">Vendas</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                startIcon={<FilterList />}
                size="medium"
                sx={{ borderRadius: 2 }}
              >
                Filtros
              </Button>

              <Tooltip
                title={
                  viewMode === "grid"
                    ? "Visualização em lista"
                    : "Visualização em grade"
                }
              >
                <IconButton
                  color="primary"
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "list" : "grid")
                  }
                >
                  {viewMode === "grid" ? <ViewList /> : <ViewModule />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {loading ? (
            viewMode === "grid" ? (
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item}>
                    <Card sx={{ borderRadius: 2 }}>
                      <Skeleton
                        variant="rectangular"
                        height={200}
                        animation="wave"
                      />
                      <CardContent>
                        <Skeleton
                          animation="wave"
                          height={24}
                          width="80%"
                          sx={{ mb: 1 }}
                        />
                        <Skeleton animation="wave" height={16} width="60%" />
                        <Skeleton
                          animation="wave"
                          height={16}
                          width="90%"
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                      <Box
                        sx={{
                          px: 2,
                          pb: 2,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Skeleton animation="wave" height={32} width={80} />
                        <Skeleton animation="wave" height={32} width={80} />
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box>
                {[1, 2, 3].map((item) => (
                  <Card key={item} sx={{ mb: 2, borderRadius: 2 }}>
                    <Grid container>
                      <Grid item xs={12} sm={3}>
                        <Skeleton
                          variant="rectangular"
                          height={150}
                          animation="wave"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CardContent>
                          <Skeleton
                            animation="wave"
                            height={24}
                            width="80%"
                            sx={{ mb: 1 }}
                          />
                          <Skeleton
                            animation="wave"
                            height={16}
                            width="60%"
                            sx={{ mb: 1 }}
                          />
                          <Skeleton animation="wave" height={16} width="90%" />
                        </CardContent>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Box sx={{ p: 2 }}>
                          <Skeleton animation="wave" height={32} width="80%" />
                          <Skeleton
                            animation="wave"
                            height={40}
                            width="100%"
                            sx={{ mt: 2 }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </Box>
            )
          ) : filteredProducts.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nenhum produto encontrado
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tente ajustar seus filtros ou termos de busca
              </Typography>
            </Box>
          ) : viewMode === "grid" ? (
            <Grid container spacing={3}>
              {filteredProducts.map(renderGridItem)}
            </Grid>
          ) : (
            <Box>{filteredProducts.map(renderListItem)}</Box>
          )}
        </Paper>
      </Fade>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        elevation={1}
        PaperProps={{
          sx: {
            minWidth: 180,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            const product = mockProducts.find((p) => p.id === menuProductId);
            if (product) handleOpenDialog("view", product);
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          Visualizar
        </MenuItem>
        <MenuItem
          onClick={() => {
            const product = mockProducts.find((p) => p.id === menuProductId);
            if (product) handleOpenDialog("edit", product);
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            showSnackbar("Produto duplicado com sucesso", "success");
            handleMenuClose();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          Duplicar
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            const product = mockProducts.find((p) => p.id === menuProductId);
            if (product) {
              handleToggleFavorite(product.id);
              handleMenuClose();
            }
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon>
            {menuProductId && favorites.includes(menuProductId) ? (
              <FavoriteBorder fontSize="small" />
            ) : (
              <Favorite fontSize="small" color="error" />
            )}
          </ListItemIcon>
          {menuProductId && favorites.includes(menuProductId)
            ? "Remover dos Favoritos"
            : "Adicionar aos Favoritos"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            const product = mockProducts.find((p) => p.id === menuProductId);
            if (product) {
              handleAddToCart(product);
              handleMenuClose();
            }
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon>
            <ShoppingCart fontSize="small" />
          </ListItemIcon>
          Adicionar ao Carrinho
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            const product = mockProducts.find((p) => p.id === menuProductId);
            if (product) handleOpenDialog("delete", product);
          }}
          sx={{ py: 1, color: "error.main" }}
        >
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          Remover
        </MenuItem>
      </Menu>

      {renderProductDialog()}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Products;
