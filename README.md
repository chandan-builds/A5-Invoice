<div align="center">
<img width="1200" height="475" alt="A5 Invoice Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# A5 Invoice Application

A professional invoice management application built with React and TypeScript for creating, editing, and printing invoices with detailed line items, calculations, and customizable footer details.

## Features

- **Invoice Creation & Editing**: Create and manage invoice headers with customer details
- **Line Item Management**: Add, edit, and remove line items with automatic calculations
- **Advanced Calculations**: Automatic calculation of scheme percentages, cash discounts, and net amounts
- **Print Functionality**: Print-optimized invoice layout with A5 landscape format
- **Responsive Design**: Clean, modern interface with a dark accent color scheme
- **Real-time Updates**: All calculations update in real-time as you edit

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `A5_INVOICE_API_KEY` in [.env.local](.env.local) to your API key (if required)
3. Run the app:
   `npm run dev`

## Project Structure

- `src/App.tsx` - Main invoice application component
- `src/main.tsx` - Application entry point
- `src/index.css` - Global styles
- `public/` - Static assets

## Deployment

This application can be deployed to any hosting platform that supports Node.js and React.
