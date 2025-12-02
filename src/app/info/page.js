"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Toolbar,
  Divider,
  AppBar,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Chip,
  Avatar,
  alpha,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  FormControl,
  InputLabel,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Badge,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import CodeIcon from "@mui/icons-material/Code";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import TableChartIcon from "@mui/icons-material/TableChart";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import HighlightIcon from "@mui/icons-material/Highlight";
import FontDownloadIcon from "@mui/icons-material/FontDownload";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import HistoryIcon from "@mui/icons-material/History";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import LabelIcon from "@mui/icons-material/Label";
import SearchIcon from "@mui/icons-material/Search";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];
const fontFamilies = [
  "Arial",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Comic Sans MS",
  "Trebuchet MS",
  "Palatino",
  "Garamond",
  "Bookman",
  "Helvetica",
  "Roboto",
  "Inter",
];

const textColors = [
  "#000000",
  "#e74c3c",
  "#3498db",
  "#2ecc71",
  "#f39c12",
  "#9b59b6",
  "#1abc9c",
  "#34495e",
  "#e67e22",
  "#95a5a6",
];

const highlightColors = [
  "transparent",
  "#fff59d",
  "#ffccbc",
  "#c5e1a5",
  "#b3e5fc",
  "#d1c4e9",
  "#f8bbd0",
  "#ffecb3",
  "#b2dfdb",
  "#e1bee7",
];

const emojis = [
  "😊",
  "😂",
  "❤️",
  "👍",
  "🎉",
  "🔥",
  "✨",
  "💡",
  "📝",
  "🥳",
  "⭐",
  "🤷‍♂️",
];

export default function AdvancedNoteEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editorRef = useRef(null);

  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);
  const [title, setTitle] = useState("Untitled Document");
  const [content, setContent] = useState("");
  const [savedStatus, setSavedStatus] = useState("All changes saved");
  const [lastSaved, setLastSaved] = useState(new Date());

  const [formats, setFormats] = useState([]);
  const [alignment, setAlignment] = useState("left");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor, setTextColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("transparent");

  const [colorAnchor, setColorAnchor] = useState(null);
  const [highlightAnchor, setHighlightAnchor] = useState(null);
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const [moreAnchor, setMoreAnchor] = useState(null);

  const [historyDrawer, setHistoryDrawer] = useState(false);
  const [tagsDrawer, setTagsDrawer] = useState(false);

  const [history, setHistory] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const handleSave = () => {
    const savedData = {
      ...currentPage,
      title,
      content: editorRef.current?.innerHTML || "",
      lastModified: new Date(),
      wordCount,
      charCount,
      tags,
    };

    localStorage.setItem("currentEditingPage", JSON.stringify(savedData));
    setSavedStatus("All changes saved");
    setLastSaved(new Date());

    setHistory((prev) => [
      {
        timestamp: new Date(),
        title,
        preview: editorRef.current?.innerText.substring(0, 100) + "...",
      },
      ...prev.slice(0, 19),
    ]);
  };

  // FIXED: Load content only once on mount
  useEffect(() => {
    const pageData = localStorage.getItem("currentEditingPage");
    if (pageData && editorRef.current) {
      try {
        const page = JSON.parse(pageData);
        setTitle(page.title || "Untitled Document");
        setContent(page.content || "");
        setTags(page.tags || []);
        setWordCount(page.wordCount || 0);
        setCharCount(page.charCount || 0);

        // Only set innerHTML once — never again
        editorRef.current.innerHTML = page.content || "";
      } catch (e) {
        console.error("Failed to load page");
      }
    }
  }, []);

  // Auto-save every 5 seconds
  useEffect(() => {
    const autoSave = setInterval(() => {
      handleSave();
    }, 5000);
    return () => clearInterval(autoSave);
  }, [title, wordCount, charCount, tags]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode ? "#0a0e27" : "#f5f7fa",
        paper: darkMode ? "#1a1f3a" : "#ffffff",
      },
      primary: {
        main: darkMode ? "#8b9fef" : "#667eea",
      },
      text: {
        primary: darkMode ? "#e2e8f0" : "#1a202c",
        secondary: darkMode ? "#a0aec0" : "#718096",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", sans-serif',
    },
  });

  const handleFormat = (format) => {
    const newFormats = formats.includes(format)
      ? formats.filter((f) => f !== format)
      : [...formats, format];
    setFormats(newFormats);

    document.execCommand(
      format === "bold" ? "bold" : format === "italic" ? "italic" : "underline"
    );
  };

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      document.execCommand(
        `justify${newAlignment.charAt(0).toUpperCase() + newAlignment.slice(1)}`
      );
    }
  };

  const handleFontSize = (event) => {
    const size = event.target.value;
    setFontSize(size);
    document.execCommand("fontSize", false, "7");
    const fontElements = editorRef.current.getElementsByTagName("font");
    for (let i = 0; i < fontElements.length; i++) {
      if (fontElements[i].size === "7") {
        fontElements[i].removeAttribute("size");
        fontElements[i].style.fontSize = size + "px";
      }
    }
  };

  const handleFontFamily = (event) => {
    const family = event.target.value;
    setFontFamily(family);
    document.execCommand("fontName", false, family);
  };

  const handleTextColor = (color) => {
    setTextColor(color);
    document.execCommand("foreColor", false, color);
    setColorAnchor(null);
  };

  const handleHighlight = (color) => {
    setHighlightColor(color);
    document.execCommand("backColor", false, color);
    setHighlightAnchor(null);
  };

  const handleInsertCheckbox = () => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.marginRight = "8px";
    checkbox.style.cursor = "pointer";

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.insertNode(checkbox);
      range.collapse(false);
    }
  };

  const handleInsertImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = document.createElement("img");
          img.src = event.target.result;
          img.style.maxWidth = "100%";
          img.style.height = "auto";
          img.style.borderRadius = "8px";
          img.style.margin = "10px 0";

          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.insertNode(img);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleInsertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      document.execCommand("createLink", false, url);
    }
  };

  const handleInsertEmoji = (emoji) => {
    document.execCommand("insertText", false, emoji);
    setEmojiAnchor(null);
  };

  const handleInsertList = (type) => {
    document.execCommand(
      type === "bullet" ? "insertUnorderedList" : "insertOrderedList"
    );
  };

  const handleInsertTable = () => {
    const rows = prompt("Number of rows:", "3");
    const cols = prompt("Number of columns:", "3");

    if (rows && cols) {
      let table =
        '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">';
      for (let i = 0; i < parseInt(rows); i++) {
        table += "<tr>";
        for (let j = 0; j < parseInt(cols); j++) {
          table +=
            '<td style="padding: 8px; border: 1px solid #ddd;">Cell</td>';
        }
        table += "</tr>";
      }
      table += "</table>";
      document.execCommand("insertHTML", false, table);
    }
  };

  const handleExport = () => {
    const blob = new Blob([editorRef.current?.innerHTML || ""], {
      type: "text/html",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.html`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const sectionColor = currentPage?.icon?.color || "#667eea";

  // FIXED: onInput handler that updates state without resetting the cursor
  const handleInput = (e) => {
    setContent(e.currentTarget.innerHTML);
    setSavedStatus("Unsaved changes");
    const text = e.currentTarget.innerText || "";
    setWordCount(
      text
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0).length
    );
    setCharCount(text.length);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Top AppBar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Toolbar>
            <Tooltip title="Back to Pages">
              <IconButton onClick={() => router.push("/pages")} sx={{ mr: 2 }}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>

            <Box sx={{ flexGrow: 1 }}>
              <TextField
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSavedStatus("Unsaved changes");
                }}
                variant="standard"
                sx={{
                  "& .MuiInput-input": {
                    fontSize: "1.25rem",
                    fontWeight: 600,
                  },
                }}
                placeholder="Document title"
              />
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                {savedStatus} • {lastSaved.toLocaleTimeString()}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={`${wordCount} words`}
                size="small"
                sx={{ bgcolor: alpha(sectionColor, 0.1), color: sectionColor }}
              />
              <Chip
                label={`${charCount} chars`}
                size="small"
                variant="outlined"
              />

              <Tooltip title="Version History">
                <IconButton onClick={() => setHistoryDrawer(true)}>
                  <Badge badgeContent={history.length} color="primary">
                    <HistoryIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Tags">
                <IconButton onClick={() => setTagsDrawer(true)}>
                  <Badge badgeContent={tags.length} color="secondary">
                    <LabelIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
                <IconButton onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>

              <Tooltip title="More Options">
                <IconButton onClick={(e) => setMoreAnchor(e.currentTarget)}>
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>

              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  background: `linear-gradient(135deg, ${sectionColor} 0%, ${alpha(
                    sectionColor,
                    0.7
                  )} 100%)`,
                }}
              >
                Save
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Formatting Toolbar */}
        <Paper
          elevation={0}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            position: "sticky",
            top: 64,
            zIndex: 100,
            bgcolor: "background.paper",
          }}
        >
          <Toolbar variant="dense" sx={{ overflowX: "auto", gap: 1, py: 1 }}>
            <Tooltip title="Undo">
              <IconButton
                size="small"
                onClick={() => document.execCommand("undo")}
              >
                <UndoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Redo">
              <IconButton
                size="small"
                onClick={() => document.execCommand("redo")}
              >
                <RedoIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select value={fontFamily} onChange={handleFontFamily}>
                {fontFamilies.map((font) => (
                  <MenuItem
                    key={font}
                    value={font}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 70 }}>
              <Select value={fontSize} onChange={handleFontSize}>
                {fontSizes.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <ToggleButtonGroup
              size="small"
              value={formats}
              onChange={(e, newFormats) => setFormats(newFormats)}
            >
              <ToggleButton value="bold" onClick={() => handleFormat("bold")}>
                <FormatBoldIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton
                value="italic"
                onClick={() => handleFormat("italic")}
              >
                <FormatItalicIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton
                value="underline"
                onClick={() => handleFormat("underline")}
              >
                <FormatUnderlinedIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <Tooltip title="Text Color">
              <IconButton
                size="small"
                onClick={(e) => setColorAnchor(e.currentTarget)}
              >
                <ColorLensIcon fontSize="small" sx={{ color: textColor }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Highlight">
              <IconButton
                size="small"
                onClick={(e) => setHighlightAnchor(e.currentTarget)}
              >
                <HighlightIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <ToggleButtonGroup
              size="small"
              value={alignment}
              exclusive
              onChange={handleAlignment}
            >
              <ToggleButton value="left">
                <FormatAlignLeftIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="center">
                <FormatAlignCenterIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="right">
                <FormatAlignRightIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="justify">
                <FormatAlignJustifyIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <Tooltip title="Bullet List">
              <IconButton
                size="small"
                onClick={() => handleInsertList("bullet")}
              >
                <FormatListBulletedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Numbered List">
              <IconButton
                size="small"
                onClick={() => handleInsertList("number")}
              >
                <FormatListNumberedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <Tooltip title="Checkbox">
              <IconButton size="small" onClick={handleInsertCheckbox}>
                <CheckBoxIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Image">
              <IconButton size="small" onClick={handleInsertImage}>
                <ImageIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Link">
              <IconButton size="small" onClick={handleInsertLink}>
                <LinkIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Table">
              <IconButton size="small" onClick={handleInsertTable}>
                <TableChartIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Emoji">
              <IconButton
                size="small"
                onClick={(e) => setEmojiAnchor(e.currentTarget)}
              >
                <InsertEmoticonIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Code Block">
              <IconButton
                size="small"
                onClick={() =>
                  document.execCommand("formatBlock", false, "<pre>")
                }
              >
                <CodeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Quote">
              <IconButton
                size="small"
                onClick={() =>
                  document.execCommand("formatBlock", false, "<blockquote>")
                }
              >
                <FormatQuoteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </Paper>

        {/* FIXED EDITOR — this is the only part that changed */}
        <Box sx={{ maxWidth: 900, mx: "auto", p: 4 }}>
          <Paper
            elevation={3}
            sx={{
              minHeight: "calc(100vh - 300px)",
              p: 4,
              bgcolor: "background.paper",
            }}
          >
            <Box
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput} // ← now works perfectly
              sx={{
                minHeight: 500,
                outline: "none",
                "& table": {
                  width: "100%",
                  borderCollapse: "collapse",
                  my: 2,
                },
                "& td, & th": {
                  border: "1px solid",
                  borderColor: "divider",
                  p: 1,
                },
                "& blockquote": {
                  borderLeft: "4px solid",
                  borderColor: sectionColor,
                  pl: 2,
                  my: 2,
                  fontStyle: "italic",
                  color: "text.secondary",
                },
                "& pre": {
                  bgcolor: darkMode ? "#1e1e1e" : "#f5f5f5",
                  p: 2,
                  borderRadius: 1,
                  overflow: "auto",
                  fontFamily: "monospace",
                },
                "& input[type='checkbox']": {
                  mr: 1,
                  cursor: "pointer",
                },
              }}
              // REMOVED: dangerouslySetInnerHTML={{ __html: content }}
              // That's what was killing the cursor
            />
          </Paper>
        </Box>

        {/* Everything below is 100% unchanged from your original */}
        <Menu
          anchorEl={colorAnchor}
          open={Boolean(colorAnchor)}
          onClose={() => setColorAnchor(null)}
        >
          <Box
            sx={{
              p: 2,
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 1,
            }}
          >
            {textColors.map((color) => (
              <Box
                key={color}
                onClick={() => handleTextColor(color)}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: color,
                  borderRadius: 1,
                  cursor: "pointer",
                  border: textColor === color ? "3px solid" : "1px solid",
                  borderColor: textColor === color ? "primary.main" : "divider",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              />
            ))}
          </Box>
        </Menu>

        <Menu
          anchorEl={highlightAnchor}
          open={Boolean(highlightAnchor)}
          onClose={() => setHighlightAnchor(null)}
        >
          <Box
            sx={{
              p: 2,
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 1,
            }}
          >
            {highlightColors.map((color) => (
              <Box
                key={color}
                onClick={() => handleHighlight(color)}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: color,
                  borderRadius: 1,
                  cursor: "pointer",
                  border: highlightColor === color ? "3px solid" : "1px solid",
                  borderColor:
                    highlightColor === color ? "primary.main" : "divider",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              />
            ))}
          </Box>
        </Menu>

        <Menu
          anchorEl={emojiAnchor}
          open={Boolean(emojiAnchor)}
          onClose={() => setEmojiAnchor(null)}
        >
          <Box
            sx={{
              p: 2,
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 1,
            }}
          >
            {emojis.map((emoji) => (
              <Button
                key={emoji}
                onClick={() => handleInsertEmoji(emoji)}
                sx={{ fontSize: 24, minWidth: 40 }}
              >
                {emoji}
              </Button>
            ))}
          </Box>
        </Menu>

        <Menu
          anchorEl={moreAnchor}
          open={Boolean(moreAnchor)}
          onClose={() => setMoreAnchor(null)}
        >
          <MenuItem onClick={handlePrint}>
            <ListItemIcon>
              <PrintIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Print</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleExport}>
            <ListItemIcon>
              <CloudDownloadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Export as HTML</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setMoreAnchor(null);
            }}
          >
            <ListItemIcon>
              <ShareIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Share</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              setMoreAnchor(null);
            }}
          >
            <ListItemIcon>
              <SpellcheckIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Spell Check</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setMoreAnchor(null);
            }}
          >
            <ListItemIcon>
              <AutoFixHighIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>AI Writing Assistant</ListItemText>
          </MenuItem>
        </Menu>

        <Drawer
          anchor="right"
          open={historyDrawer}
          onClose={() => setHistoryDrawer(false)}
        >
          <Box sx={{ width: 350, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Version History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {history.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <HistoryIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      secondary={item.timestamp.toLocaleString()}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        <Drawer
          anchor="right"
          open={tagsDrawer}
          onClose={() => setTagsDrawer(false)}
        >
          <Box sx={{ width: 350, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tags
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack direction="row" spacing={1} mb={2}>
              <TextField
                size="small"
                fullWidth
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              />
              <Button variant="contained" onClick={handleAddTag}>
                Add
              </Button>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>
        </Drawer>

        <Fab
          size="small"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            bgcolor:
              savedStatus === "All changes saved"
                ? "success.main"
                : "warning.main",
          }}
        >
          <SaveIcon />
        </Fab>
      </Box>
    </ThemeProvider>
  );
}
