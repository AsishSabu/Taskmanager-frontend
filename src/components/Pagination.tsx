import React from "react"

interface PaginationProps {
  totalData: number
  dataPerPage: number
  setCurrentPage: (page: number) => void
  currentPage: number
  position:string
}

const Pagination: React.FC<PaginationProps> = ({
  totalData,
  dataPerPage,
  setCurrentPage,
  currentPage,
  position
}) => {
  const totalPages = Math.ceil(totalData / dataPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const prev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const next = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push("...")
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1)
        pageNumbers.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        pageNumbers.push(1)
        pageNumbers.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push("...")
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }
  const customStyle="flex flex-wrap items-center justify-center gap-2 sm:gap-4  "+position

  return (
    <div className={customStyle}>
      <button
        className={`px-3 py-1 border rounded ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={prev}
        disabled={currentPage === 1}
      >
        &lt; Previous
      </button>
      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-2">
              ...
            </span>
          ) : (
            <button
              key={index}
              className={`px-3 py-1 border rounded ${
                currentPage === page ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handlePageChange(page as number)}
            >
              {page}
            </button>
          )
        )}
      </div>
      <button
        className={`px-3 py-1 border rounded ${
          currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={next}
        disabled={currentPage === totalPages}
      >
        Next &gt;
      </button>
    </div>
  )
}

export default Pagination
