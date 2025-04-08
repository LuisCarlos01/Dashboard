import { useState } from "react";
import { Box, Skeleton } from "@mui/material";
import { BrokenImage } from "@mui/icons-material";

// Imagens reais de produtos para substituir os placeholders
const productImages = {
  smartphone:
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNtYXJ0cGhvbmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
  notebook:
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bm90ZWJvb2t8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
  headphone:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  tv: "https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHZ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
  tablet:
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGFibGV0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  camera:
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtZXJhfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  mouse:
    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91c2UlMjBnYW1lcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  smartwatch:
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c21hcnR3YXRjaHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  speaker:
    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnQlMjBzcGVha2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  console:
    "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FtaW5nJTIwY29uc29sZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  printer:
    "https://images.unsplash.com/photo-1612815291912-50fdeb692452?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJpbnRlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  keyboard:
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVjaGFuaWNhbCUyMGtleWJvYXJkfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  default:
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
};

type ProductImageProps = {
  productName: string;
  placeholderUrl?: string;
  height?: number | string;
  width?: number | string;
  sx?: React.CSSProperties | any;
};

/**
 * Componente para exibir imagens de produtos com tratamento de erro e carregamento
 */
const ProductImage = ({
  productName,
  placeholderUrl,
  height = 200,
  width = "100%",
  sx = {},
}: ProductImageProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Função para determinar qual imagem usar com base no nome do produto
  const getImageUrl = (name: string): string => {
    const nameLower = name.toLowerCase();

    if (nameLower.includes("smartphone") || nameLower.includes("phone"))
      return productImages.smartphone;
    if (nameLower.includes("notebook") || nameLower.includes("laptop"))
      return productImages.notebook;
    if (nameLower.includes("headphone") || nameLower.includes("fone"))
      return productImages.headphone;
    if (nameLower.includes("tv") || nameLower.includes("smart tv"))
      return productImages.tv;
    if (nameLower.includes("tablet")) return productImages.tablet;
    if (nameLower.includes("câmera") || nameLower.includes("camera"))
      return productImages.camera;
    if (nameLower.includes("mouse")) return productImages.mouse;
    if (nameLower.includes("smartwatch") || nameLower.includes("watch"))
      return productImages.smartwatch;
    if (
      nameLower.includes("echo") ||
      nameLower.includes("speaker") ||
      nameLower.includes("dot")
    )
      return productImages.speaker;
    if (nameLower.includes("console") || nameLower.includes("game"))
      return productImages.console;
    if (nameLower.includes("printer") || nameLower.includes("impressora"))
      return productImages.printer;
    if (nameLower.includes("keyboard") || nameLower.includes("teclado"))
      return productImages.keyboard;

    return productImages.default;
  };

  // Determina a URL da imagem a ser usada
  const imageUrl = getImageUrl(productName);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
  };

  // Renderiza um skeleton durante o carregamento
  if (loading) {
    return (
      <Skeleton
        variant="rectangular"
        height={height}
        width={width}
        sx={{
          borderRadius: "8px 8px 0 0",
          ...sx,
        }}
        animation="wave"
      />
    );
  }

  // Renderiza um fallback em caso de erro
  if (error) {
    return (
      <Box
        sx={{
          height,
          width,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "action.hover",
          borderRadius: "8px 8px 0 0",
          ...sx,
        }}
      >
        <BrokenImage fontSize="large" color="action" />
      </Box>
    );
  }

  // Renderiza a imagem
  return (
    <Box
      component="img"
      src={imageUrl}
      alt={productName}
      onLoad={handleImageLoad}
      onError={handleImageError}
      sx={{
        height,
        width,
        objectFit: "cover",
        borderRadius: "8px 8px 0 0",
        ...sx,
      }}
    />
  );
};

export default ProductImage;
