import MDSpinner from 'react-md-spinner'

const Spinner = () => (
  <div className="spinner center-block">
    <MDSpinner
      size={80}
      duration={3000}
      color1="#07a2cc"
      color2="#057b9b"
      color3="#50e3c2"
    />
  </div>
)

export { Spinner }
