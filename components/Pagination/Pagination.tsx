export type PaginationProps = {
  currentPage: number;
  prevPage: () => void;
  nextPage: () => void;
  skip: (skip: number) => void;
  limit: number;
  totalRecordsCount: number;
};

export default function Pagination(props: PaginationProps) {
  const { currentPage, prevPage, nextPage, skip, limit, totalRecordsCount } =
    props;
  const totalPages = Math.ceil(totalRecordsCount / limit);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <ul className="pagination">
      <li className={`page-item previous ${isPrevDisabled ? "disabled" : ""}`}>
        <a
          href="#"
          className="page-link"
          onClick={() => !isPrevDisabled && prevPage()}
        >
          <i className="previous"></i>
        </a>
      </li>
      {getPageNumbers().map((number) => (
        <li
          key={number}
          className={`page-item ${number === currentPage ? "active" : ""}`}
        >
          <a
            href="#"
            className="page-link"
            onClick={() => number !== currentPage && skip(number)}
          >
            {number}
          </a>
        </li>
      ))}
      <li className={`page-item next ${isNextDisabled ? "disabled" : ""}`}>
        <a
          href="#"
          className="page-link"
          onClick={() => !isNextDisabled && nextPage()}
        >
          <i className="next"></i>
        </a>
      </li>
    </ul>
  );
}
