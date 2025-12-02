"use client";
import Link from "next/link";

import { useState, useMemo } from "react";
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
import FolderIcon from "@mui/icons-material/Folder";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const colorPalette = [
  {
    name: "Blue",
    primary: "#1976d2",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    name: "Green",
    primary: "#2e7d32",
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  },
  {
    name: "Orange",
    primary: "#ed6c02",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    name: "Purple",
    primary: "#9c27b0",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    name: "Red",
    primary: "#d32f2f",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  {
    name: "Teal",
    primary: "#00796b",
    gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  },
];

export default function AdvancedSectionsDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [sections, setSections] = useState([
    {
      id: 1,
      title: "Personal",
      color: colorPalette[0],
      items: 12,
      lastModified: new Date(),
    },
    {
      id: 2,
      title: "Work",
      color: colorPalette[1],
      items: 8,
      lastModified: new Date(),
    },
    {
      id: 3,
      title: "Projects",
      color: colorPalette[2],
      items: 5,
      lastModified: new Date(),
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [newSectionName, setNewSectionName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorPalette[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  // Create theme based on dark mode state
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode ? "#0a0e27" : "#fafbfc",
        paper: darkMode ? "#1a1f3a" : "#ffffff",
      },
      primary: {
        main: darkMode ? "#8b9fef" : "#667eea",
        light: darkMode ? "#a5b4f5" : "#8b9fef",
        dark: darkMode ? "#6b7fd3" : "#4f5fc9",
      },
      secondary: {
        main: darkMode ? "#9168b8" : "#764ba2",
        light: darkMode ? "#a884c7" : "#9168b8",
        dark: darkMode ? "#7552a0" : "#5c3b7f",
      },
      success: { main: "#38ef7d" },
      warning: { main: "#f5576c" },
      text: {
        primary: darkMode ? "#e2e8f0" : "#1a202c",
        secondary: darkMode ? "#a0aec0" : "#718096",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h5: {
        fontWeight: 700,
        letterSpacing: "-0.01em",
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
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
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow: darkMode
              ? "0px 8px 24px rgba(139, 159, 239, 0.3)"
              : "0px 8px 24px rgba(102, 126, 234, 0.4)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 10,
            fontWeight: 600,
            padding: "10px 24px",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
          },
        },
      },
    },
  });

  const filteredSections = useMemo(() => {
    return sections.filter((section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sections, searchQuery]);

  const handleAddClick = () => {
    setEditMode(false);
    setCurrentSection(null);
    setNewSectionName("");
    setSelectedColor(colorPalette[0]);
    setOpen(true);
  };

  const handleEditClick = (section) => {
    setEditMode(true);
    setCurrentSection(section);
    setNewSectionName(section.title);
    setSelectedColor(section.color);
    setOpen(true);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
    setNewSectionName("");
    setEditMode(false);
    setCurrentSection(null);
  };

  const handleSave = () => {
    if (!newSectionName.trim()) return;

    if (editMode && currentSection) {
      setSections(
        sections.map((s) =>
          s.id === currentSection.id
            ? {
                ...s,
                title: newSectionName.trim(),
                color: selectedColor,
                lastModified: new Date(),
              }
            : s
        )
      );
    } else {
      const newSection = {
        id: Date.now(),
        title: newSectionName.trim(),
        color: selectedColor,
        items: 0,
        lastModified: new Date(),
      };
      setSections([newSection, ...sections]);
    }
    handleClose();
  };

  const handleMenuOpen = (event, sectionId) => {
    setAnchorEl(event.currentTarget);
    setSelectedSectionId(sectionId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSectionId(null);
  };

  const handleDelete = () => {
    setSections(sections.filter((s) => s.id !== selectedSectionId));
    handleMenuClose();
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Advanced AppBar */}
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
            <Avatar
              sx={{
                bgcolor: "primary.main",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <DashboardCustomizeIcon />
            </Avatar>
            <Typography
              variant="h5"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Sections Dashboard
            </Typography>

            {/* Dark Mode Toggle */}
            <Tooltip
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <IconButton
                onClick={() => setDarkMode(!darkMode)}
                color="inherit"
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
              placeholder="Search sections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: 300,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Toolbar>
        </AppBar>

        {/* Stats Overview */}
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
                <Avatar
                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                >
                  <FolderIcon color="primary" />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {sections.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Sections
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}
                >
                  <TrendingUpIcon color="success" />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {sections.reduce((acc, s) => acc + s.items, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Items
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}
                >
                  <ColorLensIcon color="warning" />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {colorPalette.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Color Themes
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Sections Grid */}
        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {filteredSections.map((section, index) => (
              <Grid item xs={12} sm={6} md={4} key={section.id}>
                <Zoom in timeout={300 + index * 100}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
                        background: section.color.gradient,
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
                            background: section.color.gradient,
                            boxShadow: theme.shadows[3],
                          }}
                        >
                          <FolderIcon fontSize="large" />
                        </Avatar>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, section.id)}
                          sx={{
                            bgcolor: alpha(theme.palette.grey[500], 0.08),
                            "&:hover": {
                              bgcolor: alpha(theme.palette.grey[500], 0.15),
                            },
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Stack>

                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        {section.title}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        gap={1}
                        mb={2}
                      >
                        <Chip
                          label={`${section.items} items`}
                          size="small"
                          sx={{
                            bgcolor: alpha(section.color.primary, 0.1),
                            color: section.color.primary,
                            fontWeight: 600,
                          }}
                        />
                        <Chip
                          label={getTimeAgo(section.lastModified)}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="caption" color="text.secondary">
                        Last modified:{" "}
                        {section.lastModified.toLocaleDateString()}
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        component={Link}
                        href="/tasks"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          borderColor: section.color.primary,
                          color: section.color.primary,
                          "&:hover": {
                            borderColor: section.color.primary,
                            bgcolor: alpha(section.color.primary, 0.08),
                          },
                        }}
                      >
                        Open Section
                      </Button>
                    </CardActions>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>

          {filteredSections.length === 0 && (
            <Fade in>
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  px: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No sections found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchQuery
                    ? "Try adjusting your search"
                    : "Create your first section to get started"}
                </Typography>
              </Box>
            </Fade>
          )}
        </Box>

        {/* Floating Action Button */}
        <Tooltip title="Add New Section" placement="left">
          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: "fixed",
              bottom: 32,
              right: 32,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: darkMode
                ? "0px 8px 24px rgba(139, 159, 239, 0.4)"
                : "0px 8px 24px rgba(102, 126, 234, 0.4)",
              "&:hover": {
                boxShadow: darkMode
                  ? "0px 12px 32px rgba(139, 159, 239, 0.5)"
                  : "0px 12px 32px rgba(102, 126, 234, 0.5)",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s",
            }}
            onClick={handleAddClick}
          >
            <AddIcon />
          </Fab>
        </Tooltip>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            sx: { minWidth: 180, borderRadius: 2 },
          }}
        >
          <MenuItem
            onClick={() => {
              const section = sections.find((s) => s.id === selectedSectionId);
              if (section) handleEditClick(section);
            }}
          >
            <EditIcon fontSize="small" sx={{ mr: 1.5 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Advanced Dialog */}
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
            },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5" fontWeight={700}>
              {editMode ? "Edit Section" : "Create New Section"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {editMode
                ? "Update your section details"
                : "Add a new section to organize your content"}
            </Typography>
          </DialogTitle>

          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Section Name"
              fullWidth
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              sx={{ mb: 3, mt: 1 }}
              variant="outlined"
            />

            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Choose Color Theme
            </Typography>

            <Stack
              direction="row"
              spacing={1.5}
              flexWrap="wrap"
              gap={1.5}
              mt={1.5}
            >
              {colorPalette.map((color) => (
                <Tooltip key={color.name} title={color.name}>
                  <Box
                    onClick={() => setSelectedColor(color)}
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: color.gradient,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      border: 3,
                      borderColor:
                        selectedColor.name === color.name
                          ? "primary.main"
                          : "transparent",
                      "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  />
                </Tooltip>
              ))}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleClose} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={!newSectionName.trim()}
              sx={{
                textTransform: "none",
                px: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5568d3 0%, #6a4093 100%)",
                },
              }}
            >
              {editMode ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
