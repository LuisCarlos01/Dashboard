import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Divider,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Info as InfoIcon,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import { motion } from "framer-motion";

interface DashboardStatsCardProps {
  title: string;
  value: string;
  change?: {
    value: number;
    percentage: number;
    direction: "up" | "down" | "neutral";
  };
  icon: React.ReactNode;
  color?: string;
  tooltipText?: string;
  onClick?: () => void;
}

const DashboardStatsCard: React.FC<DashboardStatsCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  tooltipText = "Detalhes da estatística",
  onClick,
}) => {
  const theme = useTheme();

  // Determinar a cor baseada na direção da mudança
  const getChangeColor = (direction: "up" | "down" | "neutral") => {
    switch (direction) {
      case "up":
        return theme.palette.success.main;
      case "down":
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  // Determinar o ícone baseado na direção da mudança
  const getChangeIcon = (direction: "up" | "down" | "neutral") => {
    switch (direction) {
      case "up":
        return <ArrowUpward fontSize="small" />;
      case "down":
        return <ArrowDownward fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card
        elevation={0}
        sx={{
          height: "100%",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
          },
          cursor: onClick ? "pointer" : "default",
        }}
        onClick={onClick}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "text.secondary", fontWeight: 600 }}
            >
              {title}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: color ? `${color}15` : "primary.light",
                color: color || "primary.main",
              }}
            >
              {icon}
            </Box>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {value}
          </Typography>

          {change && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: getChangeColor(change.direction),
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {getChangeIcon(change.direction)}
                {change.percentage}%
              </Box>
              <Typography variant="body2" color="text.secondary">
                ({change.direction === "up" ? "+" : ""}
                {change.value})
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Comparado ao período anterior
            </Typography>

            <Tooltip title={tooltipText} arrow placement="top">
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardStatsCard;
