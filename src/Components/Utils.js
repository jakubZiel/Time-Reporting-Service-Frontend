import { Spinner } from "react-bootstrap"

export const BigSpinner = () => {
    
    return <div style={{display : "flex", alignItems : "center", justifyContent : "center", flexDirection:"column", textAlign:"center", minHeight:"100vh"}}>
            <Spinner style={{height:"300px", width:"300px"}} variant='info' animation="border" role="status">"
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
}