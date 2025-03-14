import { ChevronLeft, ChevronRight } from 'react-feather';
import s from './Pagination.module.scss';

export type PaginationProps = {
  maxPage: number;
  currentPage: number;
  prevPage: () => void;
  nextPage: () => void;
  skip: (skip: number) => void;
  limit: number;
  totalRecordsCount: number;
};

export default function Pagination(props: PaginationProps) {
  const { maxPage, currentPage, prevPage, nextPage, skip, totalRecordsCount } = props;
  const totalPages = maxPage;
  const PAGES = 10;

  const getPageNumbers = () => {
    const pages = [];
    const pageLimit = maxPage > PAGES ? PAGES : maxPage; // Limit of pages to display
    let startPage, endPage;

    if (totalPages <= pageLimit) {
      // Total pages less than page limit, show all pages
      startPage = 1;
      endPage = totalPages;
    } else {
      // More pages than the limit, calculate start and end pages
      const maxPagesBeforeCurrentPage = Math.floor(pageLimit / 2);
      const maxPagesAfterCurrentPage = Math.ceil(pageLimit / 2) - 1;
      if (currentPage <= maxPagesBeforeCurrentPage) {
        // Near the beginning; show first pages
        startPage = 1;
        endPage = pageLimit;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        // Near the end; show last pages
        startPage = totalPages - pageLimit + 1;
        endPage = totalPages;
      } else {
        // Somewhere in the middle; show pages around current
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  if (totalRecordsCount === 0) {
    return <div />;
  }
  return (
    <ul className="pagination">
      <li style={{ opacity: isPrevDisabled ? 0 : 1 }} className={`page-item previous ${isPrevDisabled ? 'disabled' : ''}`}>
        <a href="#" className="page-link" onClick={() => !isPrevDisabled && prevPage()}>
          <ChevronLeft size={16} color="#252f4a" />
        </a>
      </li>
      {getPageNumbers().map(number => (
        <li key={number} className={`page-item ${s['ds-pagination']} ${number === currentPage ? s['ds-pagination--active'] : ''}`}>
          <a href="#" className="page-link" onClick={() => number !== currentPage && skip(number)}>
            {number}
          </a>
        </li>
      ))}
      {!isNextDisabled && (
        <li className={`page-item next ${isNextDisabled ? 'disabled' : ''}`}>
          <a href="#" className="page-link" onClick={() => !isNextDisabled && nextPage()}>
            <ChevronRight size={16} color="#252f4a" />
          </a>
        </li>
      )}
    </ul>
  );
}
