import {Form, Button, Container, Card, Modal} from 'react-bootstrap'
import {useFetch} from 'use-http'
import APIRoot from '../API'
import {useParams, useNavigate, Link} from 'react-router-dom'
import {useRef, useContext, useState, useEffect} from 'react'
import Context from '../Identity/Context'
import { Dropdown } from 'react-bootstrap'
import DropdownMenu from 'react-bootstrap/esm/DropdownMenu'
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle'
import DropdownItem from 'react-bootstrap/esm/DropdownItem'
import axios from 'axios'
import { BigSpinner } from '../Utils'
import moment from 'moment'
import { Logout } from '../Identity/Logout'
export const ActivityCreate1 = () => {

    const {projectId} = useParams()
    const name = useRef(null)    
    const description = useRef(null)    
    const duration = useRef(null)    
    const category = useRef(null)    
    const {context, setContext} = useContext(Context)
    const [activity, setActivity] = useState({})
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const project = context.projects.find(proj => proj.id ==  projectId)

    const {post, response} = useFetch(APIRoot + "/Activity")
    
    const navigate = useNavigate()
    
    const postCreate = async () => {
        const edited = {}

        if (name.current.value != '')
            edited.name = name.current.value
        if  (description.current.value != '')
            edited.description = description.current.value
        if (category.current.value != '')
            edited.tag = category.current.value 
        if (duration.current.value != '')
            edited.durationMinutes = duration.current.value

            edited.projectId = projectId
            edited.employeeId = context.id

        setContext({...context, newActivity : true})
        setVisible(true)
        console.log("posting")
        let result = await axios.post(APIRoot + "/Activity", edited)
        console.log(result)
        navigate("/activities")
        
    }


    const tags = context.projects.find(proj => proj.id == projectId).tags.map(tag => tag.name)

    if (loading)
        return <BigSpinner/>
    else 
        return <Container  style={{display : "flex", alignItems : "center", justifyContent : "center", flexDirection:"column", textAlign:"center"}}>
            <Card style={{width: "35rem", margin: "1rem", padding: "1rem"}}>
                <h2>
                    Project : {project.name}
                </h2>
                <h5 style={{margin: "1rem"}}>
                    {moment().toDate().toLocaleString("eng", {month:'long'})} {moment().toDate().getUTCDate()}
                </h5>
            </Card>
            <Card style={{width: "65rem", margin: "1rem", padding: "1rem"}}>
                <Form style ={ {margin: "0.5rem", padding: "0.5rem", textAlign:"center"}}>
                    <Form.Group controlId='name'>
                        <Form.Label style={{fontWeight:"bold"}}>Name</Form.Label>
                        <Form.Control style={{textAlign:"center"}} ref={name}/>
                        <Form.Text></Form.Text>
                    </Form.Group>
                    <Form.Group controlId='desc'>
                        <Form.Label style={{fontWeight:"bold"}}>Description</Form.Label>
                        <Form.Control style={{textAlign:"center"}} as="textarea" ref={description}/>
                        <Form.Text></Form.Text>
                    </Form.Group>
                    <Form.Group controlId='duration'>
                        <Form.Label style={{fontWeight:"bold"}}>Duration</Form.Label>
                        <Form.Control style={{textAlign:"center"}} type="number" ref={duration}/>
                        <Form.Text></Form.Text>
                    </Form.Group>
                    <Form.Group controlId='category'>
                        <Form.Label style={{fontWeight:"bold"}}>Category</Form.Label>
                        <Form.Control style={{textAlign:"center"}} disabled ref={category}/>
                        <Form.Text></Form.Text>
                    </Form.Group>
                    <Dropdown>
                        <DropdownToggle variant="info" id="dropdown-basic" style={{ margin: "1rem", padding: "1rem"}}>
                            Choose Category
                        </DropdownToggle>
                        <DropdownMenu>
                            {tags.map((tag, index) => <DropdownItem key={index} onClick={() => category.current.value = tag}>{tag}</DropdownItem>)}
                        </DropdownMenu>
                    </Dropdown>

                </Form>
                <Button onClick={() => postCreate()} variant='success'>Create</Button>
                </Card>
            </Container>
}