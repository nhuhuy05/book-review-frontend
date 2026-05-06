import './Loading.css';
function Loading({ text = 'Loading...' }) {
  return <div className="loading-state">{text}</div>
}

export default Loading
