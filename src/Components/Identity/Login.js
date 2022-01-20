import { Button, Form} from "react-bootstrap"
import axios from 'axios';
import { useContext, useEffect, useState, useRef } from "react";
import {useFetch} from 'use-http'
import Context from "./Context";
import {Row, Col, Container, Table} from 'react-bootstrap'
import {Link, useNavigate} from 'react-router-dom'
import APIRoot from "../API";
import { BigSpinner } from "../Utils";

export const Login = () => {
    const [user, setUser] = useState(null)
    const {context, setContext} = useContext(Context)
    const [logIn, setLogIn] = useState(false)
    const passwordForm = useRef()
    const navigate = useNavigate()

    const loginAttempt = async(userId, password) => {
        try{
            const response = await axios.get(APIRoot + `/Identity/login?id=${userId}&password=${password}`)
            if (response.status == 200){
                const proj = await axios.get(APIRoot + "/Project")
                setContext({...user, projects : proj.data})
                setLogIn(false)
                navigate('/activities')
            }
        }catch(error){
            setLogIn(false)
        }

    }

    if (logIn)
        return <BigSpinner/>
    else return <Container style={{display : "flex", alignItems : "center", justifyContent : "center", flexDirection:"column", textAlign:"center"}}>
        <h1>Login as {user ? `${user.name} ${user.surname}` : "..."}</h1>
        <EmployeeList setUser={setUser}/>
        <Form>
            <Form.Group style={{margin : "1rem"}}>
                <Form.Label>Password</Form.Label>
                <Form.Control ref={passwordForm} type="password" placeholder="password"/>       
            </Form.Group>
        </Form>
        <Button onClick={() => {
            if (user){
                loginAttempt(user.id, passwordForm.current.value)
                setLogIn(true)
            }
            }}>Login</Button>    

    </Container>
}

const EmployeeList = ({setUser}) => {
    const options = {}
    const {loading, error, data = []} = useFetch(APIRoot + "/Identity", options, [])

    if (loading)
        return <div>
        </div>
    else
        if (error)
            return <Container>
                <h3>Server is down!</h3>
            </Container> 
        else
            return <Container>
                <Table hover striped bordered>
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>Name</td>
                            <td>Surname</td>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(emp => <Employee setUser={setUser} key={emp.id} emp={emp}/>)}
                    </tbody>
                </Table>
            </Container>
}

const Employee = ({emp, setUser}) => {
    const {name, surname, id} = emp
    return <tr onClick={() => setUser(emp)}>
        <td>{id}</td>
        <td>{name}</td>
        <td>{surname}</td>
    </tr>
}