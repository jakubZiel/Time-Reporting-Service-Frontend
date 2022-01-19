import {Form, Button, Container} from 'react-bootstrap'
import {useFetch} from 'use-http'
import APIRoot from '../API'
import {useParams, useNavigate} from 'react-router-dom'
import {useRef, useContext, useState} from 'react'
import Context from '../Identity/Context'

export const ProjectCreate = () => {

    const {projectId} = useParams()
    const name = useRef(null)    
    const description = useRef(null)    
    const duration = useRef(null)    
    const category = useRef(null)    
    const {context, setContext} = useContext(Context)
    const [activity, setActivity] = useState({})
    const {post, response} = useFetch(APIRoot + "/Project")
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
            edited.timeBudget = duration.current.value
        
        edited.projectId = projectId
        edited.employeeId = context.id

        duration.current.values = ''
        category.current.value = ''
        description.current.value = ''
        name.current.value = ''
                    
        response = await post("", edited)
        navigate(-1)
    }

    return <Container>
        <Form>
            <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control ref={name}/>
                <Form.Text></Form.Text>
            </Form.Group>
            <Form.Group controlId='desc'>
                <Form.Label>Description</Form.Label>
                <Form.Control ref={description}/>
                <Form.Text></Form.Text>
            </Form.Group>
            <Form.Group controlId='timeBudget'>
                <Form.Label>Time Budget</Form.Label>
                <Form.Control type="number" ref={duration}/>
                <Form.Text></Form.Text>
            </Form.Group>
            <Form.Group controlId='categories'>
                <Form.Label>Categories</Form.Label>
                <Form.Control ref={category}/>
                <Form.Text></Form.Text>
            </Form.Group>
            <Form.Group controlId='actvie'>
                <Form.Label>Active</Form.Label>
                <Form.Check checked={true} readOnly type="checkbox"/>
                <Form.Text></Form.Text>
            </Form.Group>
        </Form>
        <Button onClick={() => postCreate()} variant='success'>Create</Button>
    </Container>
}
