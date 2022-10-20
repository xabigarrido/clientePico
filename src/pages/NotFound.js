import {useNavigate} from 'react-router-dom'
export default function NotFound() {

    const navigate = useNavigate();
  return (
    <div className="btn btn-danger" onClick={()=>{
        navigate('/')
    }}>No encontrado</div>
  )
}
