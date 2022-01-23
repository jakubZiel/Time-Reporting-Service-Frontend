import {Form, Button, Container, Card} from 'react-bootstrap'
import {useFetch} from 'use-http'
import APIRoot from '../API'
import {useParams, useNavigate} from 'react-router-dom'
import {useRef, useContext, useState} from 'react'
import Context from '../Identity/Context'
import { Dropdown } from 'react-bootstrap'
import DropdownMenu from 'react-bootstrap/esm/DropdownMenu'
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle'
import DropdownItem from 'react-bootstrap/esm/DropdownItem'

export const ActivityCreate1 = () => {

    const {projectId} = useParams()
    const name = useRef(null)    
    const description = useRef(null)    
    const duration = useRef(null)    
    const category = useRef(null)    
    const {context, setContext} = useContext(Context)
    const [activity, setActivity] = useState({})
    
    const {post, response} = useFetch(APIRoot + "/Activity")
    const navigate = useNavigate()
    
    const postCreate = () => {
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
        
        duration.current.values = ''
        category.current.value = ''
        description.current.value = ''
        name.current.value = ''
                    
        postRequest(edited)
        navigate(-1)
    }

    const postRequest = async (edited) => {
        await post("", edited)
    }

    const tags = context.projects.find(proj => proj.id == projectId).tags.map(tag => tag.name)
    
    return <Container  style={{display : "flex", alignItems : "center", justifyContent : "center", flexDirection:"column", textAlign:"center"}}>
            <Card style={{width: "35rem", margin: "1rem", padding: "1rem"}}>
                <Form>
                    <Form.Group controlId='name'>
                        <Form.Label>Names</Form.Label>
                        <Form.Control ref={name}/>
                        <Form.Text></Form.Text>
                    </Form.Group>
                    <Form.Group controlId='desc'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" ref={description}/>
                        <Form.Text></Form.Text>
                    </Form.Group>
                    <Form.Group controlId='duration'>
                        <Form.Label>Duration</Form.Label>
                        <Form.Control type="number" ref={duration}/>
                        <Form.Text></Form.Text>
                    </Form.Group>
                    <Form.Group controlId='category'>
                        <Form.Label>Category</Form.Label>
                        <Form.Control disabled ref={category}/>
                        <Form.Text></Form.Text>
                    </Form.Group>
                    <Dropdown>
                        <DropdownToggle variant="info" id="dropdown-basic">
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
