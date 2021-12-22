import { useContext, useState } from "react"
import Context from "./Context"
import {Button, Modal} from 'react-bootstrap'
import {Link, useNavigate} from 'react-router-dom'


export const Logout = () => {
    const {context, setContext} = useContext(Context)

    return<div>
        Logout
        <LogoutPrompt show={true}/>
    </div>
}

export const LogoutPrompt = () => {
    const {context, setContext} = useContext(Context)    
    const [show, setShow] = useState(context != null)
    const navigate = useNavigate()

    return <Modal show={show}>
        <Modal.Header closeButton>
            <Modal.Title>Do you want to logout?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p></p>
        </Modal.Body>
        <Modal.Footer>
            <Link to={"/logout"}>
                <Button onClick={() => {
                    setShow(false)
                    setContext(null)
                }}>Confirm</Button>
            </Link>
            <Button onClick={() => navigate(-1)}>Back</Button>
        </Modal.Footer>
    </Modal>
}