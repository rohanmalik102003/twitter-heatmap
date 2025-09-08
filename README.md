# Twitter Activity Heatmap

A Next.js application that creates a GitHub-style contribution heatmap for Twitter/X activity using exported Twitter data archives.

## Features

### 🎯 Multi-Year Support
- **Year Selection**: Switch between different years of Twitter data (2023, 2024, 2025, etc.)
- **GitHub-style Interface**: Year selector dropdown and sidebar navigation for multiple years
- **Responsive Design**: Optimized for both desktop and mobile devices

### 📊 Visualizations
- **Heatmap Calendar**: GitHub-style contribution calendar showing daily tweet activity
- **Activity Statistics**: Comprehensive metrics including streaks, averages, and patterns
- **Interactive Tooltips**: Hover over days to see detailed tweet counts and dates

### 📤 Export Options
- **PNG Export**: High-resolution image download
- **SVG Export**: Vector format for scalability
- **Share Feature**: Direct sharing or clipboard copy (on supported browsers)

### 🔒 Privacy-First
- **Local Processing**: All data processing happens in your browser
- **No Server Upload**: Your Twitter data never leaves your device
- **Client-Side Only**: No external services or tracking

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
npm run dev
```

### Usage
1. **Download your Twitter archive**:
   - Go to Twitter/X Settings → Your account → Download an archive of your data
   - Wait for the email with your archive download link
   - Download the ZIP file

2. **Upload and analyze**:
   - Open the application
   - Drag and drop your Twitter archive ZIP file
   - Wait for processing (happens locally in your browser)

3. **Explore your data**:
   - View your activity heatmap for the current year
   - Switch between years using the dropdown (mobile) or sidebar (desktop)
   - Check your activity statistics and patterns
   - Export your heatmap as PNG or SVG

## Multi-Year Features

### Year Navigation
- **Dropdown Selector**: Compact year selection for single year or mobile view
- **Sidebar Navigation**: Full year list with statistics for desktop multi-year view
- **Smart Layout**: Automatically adapts based on available years and screen size

### Year Statistics
- Individual statistics for each year
- Quick overview of tweets and active days per year
- Total summary across all years

### Responsive Behavior
- **Desktop**: Sidebar navigation for multiple years, dropdown for single year
- **Mobile**: Always uses dropdown selector for better space efficiency
- **Automatic**: Layout adapts based on available data and screen size

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Charts**: Custom CSS-based heatmap (GitHub-style)
- **File Processing**: JSZip for archive extraction
- **Date Handling**: date-fns
- **Export**: html2canvas for image generation
- **Icons**: Lucide React

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── FileUploader.tsx      # Drag & drop file upload
│   ├── HeatmapCalendar.tsx   # GitHub-style calendar heatmap
│   ├── ActivityStats.tsx     # Statistics display
│   ├── YearSelector.tsx      # Dropdown year selector
│   ├── YearNavigation.tsx    # Sidebar year navigation
│   └── ExportControls.tsx    # Export functionality
├── lib/
│   ├── twitter-parser.ts     # Twitter archive processing
│   ├── date-utils.ts         # Date manipulation utilities
│   └── export-service.ts     # Export functionality
└── types/
    └── twitter.ts            # TypeScript interfaces
```

## Browser Support

- Modern browsers with ES2017+ support
- File API support for ZIP processing
- Canvas API support for export functionality
- Optional: Web Share API for native sharing

## Privacy & Security

- **No data collection**: We don't collect any personal data
- **Local processing**: All analysis happens in your browser
- **No tracking**: No analytics or third-party services
- **Open source**: Full transparency of data handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details