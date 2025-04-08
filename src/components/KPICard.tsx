import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Tooltip,
  IconButton,
  useTheme,
} from "@mui/material";
import { TrendingUp, TrendingDown, Info, MoreVert } from "@mui/icons-material";

export interface KPICardProps {
  title: string;
  value: string;
  change: number;
  changeType: "increase" | "decrease";
  icon: React.ReactNode;
  color?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  color = "#3a7bd5",
}) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        position: "relative",
        overflow: "visible",
        height: "100%",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 10px 0 rgba(58, 123, 213, 0.1)",
        border: "1px solid rgba(230, 235, 245, 0.9)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 20px 0 rgba(58, 123, 213, 0.15)",
        },
      }}
    >
      <CardContent sx={{ p: 3, pb: "24px !important" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Typography
            color="text.secondary"
            sx={{
              fontWeight: 600,
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            {title}
            <Tooltip title="Mais informações" arrow>
              <Info
                sx={{
                  fontSize: 16,
                  color: "text.disabled",
                  cursor: "pointer",
                  "&:hover": { color: "primary.main" },
                }}
              />
            </Tooltip>
          </Typography>

          <IconButton size="small" sx={{ ml: 1, mt: -0.5 }}>
            <MoreVert fontSize="small" sx={{ color: "text.disabled" }} />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: `${color}15`,
              color: color,
              width: 48,
              height: 48,
              mr: 2,
              boxShadow: `0 4px 12px 0 ${color}25`,
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              {value}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                px: 1,
                py: 0.25,
                borderRadius: 10,
                bgcolor:
                  changeType === "increase"
                    ? "rgba(0, 200, 83, 0.1)"
                    : "rgba(244, 67, 54, 0.1)",
                width: "fit-content",
              }}
            >
              {changeType === "increase" ? (
                <TrendingUp
                  fontSize="small"
                  sx={{
                    mr: 0.5,
                    color: "success.main",
                    fontSize: "1rem",
                  }}
                />
              ) : (
                <TrendingDown
                  fontSize="small"
                  sx={{
                    mr: 0.5,
                    color: "error.main",
                    fontSize: "1rem",
                  }}
                />
              )}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color:
                    changeType === "increase" ? "success.main" : "error.main",
                }}
              >
                {change > 0 ? "+" : ""}
                {change}%
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            height: 4,
            width: "100%",
            borderRadius: 2,
            bgcolor: `${color}15`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: `${Math.min(Math.abs(change) * 5, 100)}%`,
              bgcolor: color,
              borderRadius: 2,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default KPICard;
