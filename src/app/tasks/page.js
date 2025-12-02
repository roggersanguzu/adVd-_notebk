"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Fab,
  Card,
  CardContent,
  CardActions,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  Zoom,
  Fade,
  AppBar,
  Toolbar,
  InputAdornment,
  Grid,
  alpha,
  Divider,
  Avatar,
  Stack,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import DescriptionIcon from "@mui/icons-material/Description";
import ArticleIcon from "@mui/icons-material/Article";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import NoteIcon from "@mui/icons-material/Note";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BookIcon from "@mui/icons-material/Book";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CreateIcon from "@mui/icons-material/Create";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";

const pageIcons = [
  { name: "Document", icon: DescriptionIcon, color: "#1976d2" },
  { name: "Article", icon: ArticleIcon, color: "#2e7d32" },
  { name: "Book", icon: MenuBookIcon, color: "#ed6c02" },
  { name: "Note", icon: NoteIcon, color: "#9c27b0" },
  { name: "Assignment", icon: AssignmentIcon, color: "#d32f2f" },
  { name: "Library", icon: LibraryBooksIcon, color: "#00796b" },
  { name: "File", icon: InsertDriveFileIcon, color: "#0288d1" },
  { name: "Folder", icon: FolderOpenIcon, color: "#f57c00" },
  { name: "Write", icon: CreateIcon, color: "#7b1fa2" },
  { name: "Sticky Note", icon: StickyNote2Icon, color: "#fbc02d" },
  { name: "Reference", icon: BookIcon, color: "#5d4037" },
  { name: "Snippet", icon: TextSnippetIcon, color: "#455a64" },
];

// Initial pages – dates created outside render (safe!)
const createInitialPages = () => {
  const now = new Date();
  return [
    {
      id: 1,
      title: "Meeting Notes",
      icon: pageIcons[0],
      lastModified: new Date(now),
      content: "Important meeting notes...",
    },
    {
      id: 2,
      title: "Project Brief",
      icon: pageIcons[1],
      lastModified: new Date(now.getTime() - 86400000),
      content: "Project overview...",
    },
    {
      id: 3,
      title: "Research Document",
      icon: pageIcons[2],
      lastModified: new Date(now.getTime() - 172800000),
      content: "Research findings...",
    },
    {
      id: 4,
      title: "Quick Notes",
      icon: pageIcons[9],
      lastModified: new Date(now.getTime() - 3600000),
      content: "Quick notes...",
    },
  ];
};

export default function AdvancedPagesDashboard() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [pages, setPages] = useState(createInitialPages());

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(pageIcons[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPageId, setSelectedPageId] = useState(null);

  // Safe current time for "time ago" without triggering React warnings
  const nowRef = useRef(Date.now());
  useEffect(() => {
    nowRef.current = Date.now();
    const timer = setInterval(() => {
      nowRef.current = Date.now();
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Load currentSection from localStorage – safe & warning-free
  useEffect(() => {
    try {
      const sectionData = localStorage.getItem("currentSection");
      if (sectionData) {
        setCurrentSection(JSON.parse(sectionData));
      }
    } catch (err) {
      console.error("Failed to load currentSection from localStorage", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode ? "#0a0e27" : "#fafbfc",
        paper: darkMode ? "#1a1f3a" : "#ffffff",
      },
      primary: { main: darkMode ? "#8b9fef" : "#667eea" },
      secondary: { main: darkMode ? "#9168b8" : "#764ba2" },
      success: { main: "#38ef7d" },
      warning: { main: "#f5576c" },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: darkMode
              ? "0px 4px 20px rgba(0,0,0,0.4)"
              : "0px 4px 20px rgba(0,0,0,0.08)",
          },
        },
      },
    },
  });

  const filteredPages = useMemo(
    () =>
      pages.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [pages, searchQuery]
  );

  const recentlyModified = pages.filter(
    (p) =>
      (nowRef.current - p.lastModified.getTime()) / (1000 * 60 * 60 * 24) < 7
  ).length;

  const sectionColor = currentSection?.color || {
    primary: "#667eea",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((nowRef.current - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const handleAddClick = () => {
    setEditMode(false);
    setCurrentPage(null);
    setNewPageTitle("");
    setSelectedIcon(pageIcons[0]);
    setOpen(true);
  };

  const handleEditClick = (page) => {
    setEditMode(true);
    setCurrentPage(page);
    setNewPageTitle(page.title);
    setSelectedIcon(page.icon);
    setOpen(true);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
    setNewPageTitle("");
    setEditMode(false);
    setCurrentPage(null);
  };

  const handleSave = () => {
    if (!newPageTitle.trim()) return;

    if (editMode && currentPage) {
      setPages(
        pages.map((p) =>
          p.id === currentPage.id
            ? {
                ...p,
                title: newPageTitle.trim(),
                icon: selectedIcon,
                lastModified: new Date(),
              }
            : p
        )
      );
    } else {
      const newPage = {
        id: Date.now(),
        title: newPageTitle.trim(),
        icon: selectedIcon,
        lastModified: new Date(),
        content: "",
      };
      setPages([newPage, ...pages]);
    }
    handleClose();
  };

  const handleMenuOpen = (e, id) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setSelectedPageId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPageId(null);
  };

  const handleDelete = () => {
    setPages(pages.filter((p) => p.id !== selectedPageId));
    handleMenuClose();
  };

  const handleBack = () => router.push("/");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        {/* AppBar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Toolbar sx={{ gap: 2 }}>
            <Tooltip title="Back to Sections">
              <IconButton
                onClick={handleBack}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>

            <Avatar
              sx={{
                bgcolor: "primary.main",
                background: sectionColor.gradient,
              }}
            >
              <DescriptionIcon />
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: sectionColor.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {currentSection
                  ? `${currentSection.title} - Pages`
                  : "Pages Dashboard"}
              </Typography>
            </Box>

            <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
              <IconButton
                onClick={() => setDarkMode(!darkMode)}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>

            <TextField
              size="small"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Toolbar>
        </AppBar>

        {/* Stats */}
        <Box
          sx={{
            px: 4,
            py: 3,
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: alpha(sectionColor.primary, 0.1) }}>
                  <DescriptionIcon sx={{ color: sectionColor.primary }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {pages.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Pages
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: alpha("#38ef7d", 0.1) }}>
                  <AssignmentIcon color="success" />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {recentlyModified}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Modified This Week
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: alpha("#f5576c", 0.1) }}>
                  <CreateIcon color="warning" />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {pageIcons.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available Icons
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Pages Grid */}
        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {filteredPages.map((page, i) => {
              const PageIcon = page.icon.icon;
              return (
                <Grid item xs={12} sm={6} md={4} key={page.id}>
                  <Zoom in timeout={300 + i * 100}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.3s",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: darkMode
                            ? "0px 12px 40px rgba(0,0,0,0.6)"
                            : "0px 12px 40px rgba(0,0,0,0.15)",
                        },
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 6,
                          background: `linear-gradient(135deg, ${
                            page.icon.color
                          } 0%, ${alpha(page.icon.color, 0.7)} 100%)`,
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          mb={2}
                        >
                          <Avatar
                            sx={{
                              width: 56,
                              height: 56,
                              bgcolor: alpha(page.icon.color, 0.1),
                              color: page.icon.color,
                            }}
                          >
                            <PageIcon fontSize="large" />
                          </Avatar>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, page.id)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Stack>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                          {page.title}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          gap={1}
                          mb={2}
                        >
                          <Chip
                            label={page.icon.name}
                            size="small"
                            icon={<PageIcon />}
                            sx={{
                              bgcolor: alpha(page.icon.color, 0.1),
                              color: page.icon.color,
                            }}
                          />
                          <Chip
                            label={getTimeAgo(page.lastModified)}
                            size="small"
                            variant="outlined"
                          />
                        </Stack>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="caption" color="text.secondary">
                          Last modified:{" "}
                          {page.lastModified.toLocaleDateString()}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          fullWidth
                          variant="outlined"
                          href="/info"
                          sx={{
                            borderColor: page.icon.color,
                            color: page.icon.color,
                            "&:hover": {
                              bgcolor: alpha(page.icon.color, 0.08),
                            },
                          }}
                        >
                          Open Page
                        </Button>
                      </CardActions>
                    </Card>
                  </Zoom>
                </Grid>
              );
            })}
          </Grid>

          {filteredPages.length === 0 && (
            <Fade in>
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No pages found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchQuery
                    ? "Try adjusting your search"
                    : "Create your first page to get started"}
                </Typography>
              </Box>
            </Fade>
          )}
        </Box>

        {/* FAB */}
        <Tooltip title="Add New Page" placement="left">
          <Fab
            onClick={handleAddClick}
            sx={{
              position: "fixed",
              bottom: 32,
              right: 32,
              background: sectionColor.gradient,
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              const p = pages.find((x) => x.id === selectedPageId);
              if (p) handleEditClick(p);
            }}
          >
            <EditIcon fontSize="small" sx={{ mr: 1.5 }} /> Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} /> Delete
          </MenuItem>
        </Menu>

        {/* Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography variant="h5" fontWeight={700}>
              {editMode ? "Edit Page" : "Create New Page"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {editMode
                ? "Update your page details"
                : "Add a new page to this section"}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              label="Page Title"
              fullWidth
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              sx={{ mt: 1, mb: 3 }}
            />
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Choose Page Icon
            </Typography>
            <Grid container spacing={1.5} mt={1}>
              {pageIcons.map((iconData) => {
                const Icon = iconData.icon;
                return (
                  <Grid item key={iconData.name}>
                    <Tooltip title={iconData.name}>
                      <Box
                        onClick={() => setSelectedIcon(iconData)}
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 2,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          border: 2,
                          borderColor:
                            selectedIcon.name === iconData.name
                              ? iconData.color
                              : "divider",
                          bgcolor:
                            selectedIcon.name === iconData.name
                              ? alpha(iconData.color, 0.1)
                              : "transparent",
                          "&:hover": {
                            transform: "scale(1.05)",
                            borderColor: iconData.color,
                            bgcolor: alpha(iconData.color, 0.08),
                          },
                        }}
                      >
                        <Icon
                          sx={{
                            fontSize: 32,
                            color:
                              selectedIcon.name === iconData.name
                                ? iconData.color
                                : "text.secondary",
                          }}
                        />
                      </Box>
                    </Tooltip>
                  </Grid>
                );
              })}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={!newPageTitle.trim()}
              sx={{ background: sectionColor.gradient }}
            >
              {editMode ? "Update Page" : "Create Page"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
