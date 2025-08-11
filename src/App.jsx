"use client";

import { useState, useEffect } from "react";
import { fonts } from "./data/fonts";
import { useDarkMode } from "./hooks/useDarkMode";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { FontCard } from "./components/FontCard";
import { Pagination } from "./components/Pagination";
import { TryFontModal } from "./components/TryFontModal";
import { BuyMeCoffeeModal } from "./components/BuyMeCoffeeModal";

export default function FontShowcase() {
  const [darkMode, setDarkMode] = useDarkMode();
  const [selectedFont, setSelectedFont] = useState(null);
  const [showCoffee, setShowCoffee] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const FONTS_PER_PAGE = 3;

  const filteredFonts = fonts.filter(
    (font) =>
      font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      font.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredFonts.length / FONTS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  const getCurrentPageFonts = () => {
    const startIndex = currentPage * FONTS_PER_PAGE;
    return filteredFonts.slice(startIndex, startIndex + FONTS_PER_PAGE);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-950" : "bg-gray-50"
      }`}
    >
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onShowCoffee={() => setShowCoffee(true)}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          darkMode={darkMode}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {getCurrentPageFonts().map((font, index) => (
            <FontCard
              key={`${font.family}-${currentPage}-${index}`}
              font={font}
              darkMode={darkMode}
              onTryFont={setSelectedFont}
            />
          ))}
        </div>

        {filteredFonts.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              No fonts found matching "{searchQuery}"
            </p>
          </div>
        )}

        {filteredFonts.length > 0 && (
           <Pagination
             currentPage={currentPage}
             totalPages={totalPages}
             goToPrevPage={goToPrevPage}
             goToNextPage={goToNextPage}
             darkMode={darkMode}
           />
        )}
      </main>

      <footer
        className={`border-t mt-16 ${darkMode ? "border-gray-800" : "border-gray-200"}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-8"></div>
      </footer>

      {selectedFont && (
        <TryFontModal
          font={selectedFont}
          darkMode={darkMode}
          onClose={() => setSelectedFont(null)}
        />
      )}

      {showCoffee && (
        <BuyMeCoffeeModal
          darkMode={darkMode}
          onClose={() => setShowCoffee(false)}
        />
      )}
    </div>
  );
}
