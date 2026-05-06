import './Button.css';
function Button({ children, className = '', variant = 'primary', ...props }) {
  return (
    <button
      className={`button button--${variant} ${className}`.trim()}
      {...props}
      type={props.type ?? 'button'}
    >
      {children}
    </button>
  )
}

export default Button
