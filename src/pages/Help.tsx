import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  InputAdornment,
  Chip,
  Divider,
  IconButton,
  useTheme,
  Fade,
  Avatar,
} from "@mui/material";
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  HelpOutline as HelpIcon,
  Category as CategoryIcon,
  BookmarkBorder as BookmarkIcon,
  Help as HelpCircleIcon,
  ContactSupport as SupportIcon,
  VideoLibrary as VideoIcon,
  Article as ArticleIcon,
  QuestionAnswer as FAQIcon,
  Lightbulb as TipIcon,
  Bookmark as BookmarkFilledIcon,
  ArrowForward as ArrowIcon,
  Star as StarIcon,
  Chat as ChatIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNotifications } from "../contexts/NotificationContext";

// Dados mockados para FAQs e tópicos de ajuda
const faqData = [
  {
    id: 1,
    question: "Como posso alterar minha senha?",
    answer:
      'Para alterar sua senha, acesse a página de perfil clicando no seu avatar no canto superior direito e selecione "Meu Perfil". Na aba "Segurança", você poderá definir uma nova senha.',
  },
  {
    id: 2,
    question: "Como adicionar um novo usuário ao sistema?",
    answer:
      'Acesse a página "Usuários" através do menu lateral. No canto superior direito, clique no botão "Adicionar Usuário" e preencha as informações solicitadas no formulário.',
  },
  {
    id: 3,
    question: "Como cadastrar um novo produto?",
    answer:
      'Navegue até a página "Produtos" usando o menu lateral. Clique no botão "Adicionar Produto" e preencha os detalhes como nome, descrição, preço e estoque.',
  },
  {
    id: 4,
    question: "Como exportar relatórios de vendas?",
    answer:
      'Na página "Vendas", você encontrará botões para exportar relatórios em diferentes formatos como PDF, Excel ou CSV. Escolha o período desejado e clique em "Exportar".',
  },
  {
    id: 5,
    question: "Como personalizar o tema do sistema?",
    answer:
      'Você pode alternar entre o tema claro e escuro clicando no ícone de lua/sol na barra superior. Para mais opções de personalização, acesse a página "Configurações".',
  },
  {
    id: 6,
    question: "Onde encontro notificações do sistema?",
    answer:
      "As notificações estão disponíveis no ícone de sino na barra superior. Um contador indica quantas notificações não lidas você possui.",
  },
  {
    id: 7,
    question: "Como filtrar produtos por categoria?",
    answer:
      'Na página "Produtos", utilize o painel de filtros à esquerda. Selecione a categoria desejada e aplique o filtro para visualizar apenas os produtos relacionados.',
  },
  {
    id: 8,
    question: "O sistema possui aplicativo móvel?",
    answer:
      'Sim, oferecemos aplicativos para Android e iOS. Você pode baixá-los nas respectivas lojas de aplicativos buscando por "Dashboard Admin".',
  },
];

const helpTopics = [
  {
    id: 1,
    title: "Primeiros Passos",
    icon: <HelpCircleIcon />,
    color: "#3a7bd5",
    articles: 8,
  },
  {
    id: 2,
    title: "Gerenciamento de Usuários",
    icon: <CategoryIcon />,
    color: "#6c63ff",
    articles: 12,
  },
  {
    id: 3,
    title: "Catálogo de Produtos",
    icon: <ArticleIcon />,
    color: "#00bfa5",
    articles: 15,
  },
  {
    id: 4,
    title: "Sistema de Vendas",
    icon: <SupportIcon />,
    color: "#f50057",
    articles: 10,
  },
  {
    id: 5,
    title: "Relatórios e Dashboards",
    icon: <FAQIcon />,
    color: "#ff9800",
    articles: 7,
  },
  {
    id: 6,
    title: "Tutoriais em Vídeo",
    icon: <VideoIcon />,
    color: "#e91e63",
    articles: 5,
  },
];

// Lista de termos de pesquisa para autocomplete
const searchOptions = [
  "Como alterar senha",
  "Adicionar usuário",
  "Cadastrar produto",
  "Exportar relatórios",
  "Mudar tema",
  "Notificações do sistema",
  "Filtrar produtos",
  "Aplicativo móvel",
  "Configurações",
  "Perfil de usuário",
  "Dashboard",
  "Gráficos",
  "Estatísticas",
  "Login",
  "Registro",
];

const Help = () => {
  const theme = useTheme();
  const { addNotification } = useNotifications();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState(faqData);
  const [expandedFaq, setExpandedFaq] = useState<number | false>(false);
  const [bookmarkedFaqs, setBookmarkedFaqs] = useState<number[]>([]);

  // Filtrar FAQs com base no termo de pesquisa
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFaqs(faqData);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = faqData.filter(
      (faq) =>
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term)
    );

    setFilteredFaqs(filtered);
  }, [searchTerm]);

  // Manipuladores para expandir/colapsar FAQs
  const handleAccordionChange =
    (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedFaq(isExpanded ? panel : false);
    };

  // Adicionar/remover favorito
  const handleToggleBookmark = (id: number) => {
    setBookmarkedFaqs((prev) => {
      if (prev.includes(id)) {
        addNotification({
          message: "FAQ removida dos favoritos",
          severity: "info",
        });
        return prev.filter((item) => item !== id);
      } else {
        addNotification({
          message: "FAQ adicionada aos favoritos",
          severity: "success",
        });
        return [...prev, id];
      }
    });
  };

  // Simular envio de pergunta
  const handleSendQuestion = () => {
    if (!searchTerm.trim()) {
      addNotification({
        message: "Por favor, digite sua pergunta",
        severity: "warning",
      });
      return;
    }

    addNotification({
      message: "Sua pergunta foi enviada para o suporte",
      severity: "success",
    });

    setSearchTerm("");
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ py: 3, maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          Central de Ajuda
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Encontre respostas para suas dúvidas e aprenda a usar o sistema
        </Typography>

        {/* Seção de Pesquisa */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          sx={{ mb: 5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundImage:
                "linear-gradient(135deg, #6c63ff22 0%, #3a7bd522 100%)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h5"
              align="center"
              sx={{ mb: 3, fontWeight: 600 }}
            >
              Como podemos ajudar?
            </Typography>

            <Autocomplete
              freeSolo
              options={searchOptions}
              value={searchTerm}
              onChange={(event, newValue) => {
                setSearchTerm(newValue || "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  placeholder="Digite sua dúvida aqui..."
                  variant="outlined"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 2,
                      bgcolor: "background.paper",
                      "& .MuiAutocomplete-input": {
                        padding: "12px 0",
                      },
                    },
                  }}
                />
              )}
            />

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleSendQuestion}
                sx={{
                  mt: 1,
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Enviar Pergunta
              </Button>
            </Box>
          </Paper>
        </Box>

        <Grid container spacing={4}>
          {/* Coluna da Esquerda - FAQs */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Perguntas Frequentes
            </Typography>

            {filteredFaqs.length > 0 ? (
              <Box>
                {filteredFaqs.map((faq) => (
                  <Accordion
                    key={faq.id}
                    expanded={expandedFaq === faq.id}
                    onChange={handleAccordionChange(faq.id)}
                    elevation={0}
                    sx={{
                      mb: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      "&:before": { display: "none" },
                      "&.Mui-expanded": {
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`faq-${faq.id}-content`}
                      id={`faq-${faq.id}-header`}
                      sx={{
                        borderRadius: 2,
                        "&.Mui-expanded": {
                          borderBottom: "1px solid",
                          borderBottomColor: "divider",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <FAQIcon color="primary" sx={{ mr: 2, fontSize: 20 }} />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 500, flex: 1 }}
                        >
                          {faq.question}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleBookmark(faq.id);
                          }}
                          sx={{ mr: 1 }}
                        >
                          {bookmarkedFaqs.includes(faq.id) ? (
                            <BookmarkFilledIcon
                              fontSize="small"
                              color="primary"
                            />
                          ) : (
                            <BookmarkIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 3 }}>
                      <Typography variant="body1">{faq.answer}</Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 2,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Esta resposta foi útil?
                        </Typography>
                        <IconButton size="small" color="primary" sx={{ ml: 1 }}>
                          <StarIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 2,
                  bgcolor: "action.hover",
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Nenhum resultado encontrado para "{searchTerm}"
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tente refinar sua pesquisa ou envie uma pergunta ao suporte
                </Typography>
              </Box>
            )}

            {bookmarkedFaqs.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  FAQs Favoritas
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <List>
                    {bookmarkedFaqs.map((id) => {
                      const faq = faqData.find((f) => f.id === id);
                      if (!faq) return null;

                      return (
                        <ListItem
                          key={`bookmark-${id}`}
                          sx={{
                            px: 2,
                            borderRadius: 1,
                            "&:hover": { bgcolor: "action.hover" },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <BookmarkFilledIcon
                              color="primary"
                              fontSize="small"
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={faq.question}
                            primaryTypographyProps={{
                              variant: "body2",
                              fontWeight: 500,
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleToggleBookmark(id)}
                          >
                            <BookmarkIcon fontSize="small" />
                          </IconButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Paper>
              </Box>
            )}
          </Grid>

          {/* Coluna da Direita - Tópicos de Ajuda */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Tópicos de Ajuda
            </Typography>

            <Grid container spacing={2}>
              {helpTopics.map((topic) => (
                <Grid item xs={12} key={topic.id}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      "&:hover": {
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        borderColor: "primary.main",
                      },
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                  >
                    <CardContent sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: `${topic.color}20`,
                          color: topic.color,
                          width: 48,
                          height: 48,
                          mr: 2,
                        }}
                      >
                        {topic.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {topic.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {topic.articles} artigos
                        </Typography>
                      </Box>
                      <ArrowIcon sx={{ color: "text.secondary" }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Dicas Rápidas
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <List sx={{ p: 0 }}>
                  <ListItem sx={{ px: 0, pt: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <TipIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Use atalhos de teclado"
                      secondary="Pressione '?' para ver todos os atalhos disponíveis"
                    />
                  </ListItem>
                  <Divider component="li" sx={{ my: 1.5 }} />
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <TipIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Personalize seu dashboard"
                      secondary="Arraste e solte widgets para organizar sua visualização"
                    />
                  </ListItem>
                  <Divider component="li" sx={{ my: 1.5 }} />
                  <ListItem sx={{ px: 0, pb: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <TipIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Salve filtros frequentes"
                      secondary="Crie filtros personalizados para acesso rápido"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    zIndex: 0,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -30,
                    left: -30,
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.07)",
                    zIndex: 0,
                  }}
                />

                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Precisa de mais ajuda?
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                    Nossa equipe de suporte está disponível para ajudar com
                    qualquer dúvida.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<ChatIcon />}
                    sx={{
                      bgcolor: "white",
                      color: "primary.main",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.9)",
                      },
                    }}
                  >
                    Contatar Suporte
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default Help;
