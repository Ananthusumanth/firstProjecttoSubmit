import './index.css'

const Pagination = props => {
  const {
    setCurrentPage,
    currentPage,
    totalpages,
  } = props

  const pagePrev = currentPage === 1 ? 1 : currentPage - 1
  const pageNext = currentPage === totalpages ? totalpages : currentPage + 1

  return (
    <div className="main-pagination-container">
      <div className="pageSection">
        <button
          type="button"
          disabled={currentPage === 1}
          className={currentPage === 1 ? 'prevNextButtonOver' : 'prevNextButton'}
          onClick={() => setCurrentPage(pagePrev)}
        >
          Prev
        </button>
        <p className="currentPage">{currentPage}/{totalpages}</p>
        <button
          type="button"
          disabled={currentPage === totalpages}
          className={
            currentPage === totalpages ? 'prevNextButtonOver' : 'prevNextButton'
          }
          onClick={() => setCurrentPage(pageNext)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
export default Pagination