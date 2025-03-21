# IITSEC Data Analyzer

A web-based tool for analyzing IITSEC submission data. This tool provides analytics and visualizations for submission data, including cross-tabulations and percentage breakdowns across different categories.

## Live Demo

The application is hosted and can be accessed at:
https://aughey.com/iitsec_stats_selfservice/

## Features

- Drag-and-drop Excel file upload
- Automatic data processing and analytics
- Cross-tabulation analysis for:
  - Subcommittee vs Organization Type
  - International Status vs Subcommittee
  - Country vs Subcommittee
- Percentage breakdown of submissions by organization type
- Raw data preview with sortable columns

## How to Use

1. Visit the application at https://aughey.com/iitsec_stats_selfservice/
2. Drag and drop your Excel file onto the upload area (or click to select a file)
3. The application will automatically process your data and display:
   - Analytics results with cross-tabulations
   - Percentage breakdowns
   - Raw data preview

## Local Development

To run this project locally:

1. Clone the repository:
```bash
git clone https://github.com/aughey/iitsec_stats_selfservice.git
cd iitsec_stats_selfservice
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building

To build the project for production:

```bash
npm run build
```

This will create a static export in the `out` directory.

## Deployment

The site is automatically deployed when changes are pushed to the main branch. The deployment process is handled by GitHub Actions.

## Technology Stack

- Next.js 15.2
- React 19
- TypeScript
- Tailwind CSS
- XLSX for Excel file processing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
#   i i t s e c _ s t a t s _ s e l f s e r v i c e 
 
 