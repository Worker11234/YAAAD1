import React from 'react';
import { colors, typography, spacing, borderRadius } from '../tokens';

interface PaginationProps {
  /**
   * Current page
   */
  currentPage: number;
  
  /**
   * Total number of pages
   */
  totalPages: number;
  
  /**
   * Function to call when a page is selected
   */
  onPageChange: (page: number) => void;
  
  /**
   * Number of pages to show on each side of the current page
   */
  siblingCount?: number;
  
  /**
   * Whether to show the first and last page buttons
   */
  showFirstLast?: boolean;
  
  /**
   * Whether to show the previous and next page buttons
   */
  showPrevNext?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  className = '',
  ...props
}: PaginationProps) {
  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Add first page
    if (showFirstLast && currentPage > siblingCount + 2) {
      pageNumbers.push(1);
      if (currentPage > siblingCount + 3) {
        pageNumbers.push('...');
      }
    }
    
    // Add pages around current page
    const startPage = Math.max(1, currentPage - siblingCount);
    const endPage = Math.min(totalPages, currentPage + siblingCount);
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Add last page
    if (showFirstLast && currentPage < totalPages - siblingCount - 1) {
      if (currentPage < totalPages - siblingCount - 2) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <nav
      className={`flex items-center justify-center ${className}`}
      aria-label="Pagination"
      {...props}
    >
      <ul className="flex items-center space-x-1">
        {/* First Page */}
        {showFirstLast && (
          <li>
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className={`
                p-2 rounded-md
                ${currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-sage-50 hover:text-sage-700'}
                focus:outline-none focus:ring-2 focus:ring-sage-500
              `}
              aria-label="Go to first page"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </li>
        )}
        
        {/* Previous Page */}
        {showPrevNext && (
          <li>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`
                p-2 rounded-md
                ${currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-sage-50 hover:text-sage-700'}
                focus:outline-none focus:ring-2 focus:ring-sage-500
              `}
              aria-label="Go to previous page"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </li>
        )}
        
        {/* Page Numbers */}
        {pageNumbers.map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`
                  w-10 h-10 rounded-md
                  ${currentPage === page
                    ? 'bg-sage-600 text-white'
                    : 'text-gray-700 hover:bg-sage-50 hover:text-sage-700'}
                  focus:outline-none focus:ring-2 focus:ring-sage-500
                `}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        
        {/* Next Page */}
        {showPrevNext && (
          <li>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`
                p-2 rounded-md
                ${currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-sage-50 hover:text-sage-700'}
                focus:outline-none focus:ring-2 focus:ring-sage-500
              `}
              aria-label="Go to next page"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </li>
        )}
        
        {/* Last Page */}
        {showFirstLast && (
          <li>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`
                p-2 rounded-md
                ${currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-sage-50 hover:text-sage-700'}
                focus:outline-none focus:ring-2 focus:ring-sage-500
              `}
              aria-label="Go to last page"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}