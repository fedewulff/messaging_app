function ErrorRequest({ status }) {
  return (
    <div className="error-on-request">
      <h1>Oops, this is unexpected...</h1>
      <p>Error code: {status}</p>
      <p>An error has occured and we are working on a fix.</p>
      <p>Refresh the page or try again later.</p>
    </div>
  )
}

export default ErrorRequest
