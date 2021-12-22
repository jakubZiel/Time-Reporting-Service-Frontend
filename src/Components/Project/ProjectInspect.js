import {Form, Button, Container} from 'react-bootstrap'
import {useFetch} from 'use-http'
import APIRoot from '../API'
import {useParams, useNavigate} from 'react-router-dom'
import {useRef, useContext, useState, useEffect} from 'react'
import Context from '../Identity/Context'



export const ProjectInspect = () => {

    const {id} = useParams()
    const context = useContext(Context)
    const [project, setProject] = useState(context.context.projects.find(proj => proj.id == id))
    const navigate = useNavigate()
    const name = useRef(null)    

    return <Container>
        <Form>
            <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control disabled placeholder={project.name} ref={name}/>
                <Form.Text></Form.Text>
            </Form.Group>
            <Form.Group controlId='desc'>
                <Form.Label>Description</Form.Label>
                <Form.Control placeholder={project.description} disabled/>
                <Form.Text></Form.Text>
            </Form.Group>
            <Form.Group controlId='budget'>
                <Form.Label>Time Budget</Form.Label>
                <Form.Control placeholder={project.timeBudget} type="number" disabled/>
                <Form.Text></Form.Text>
            </Form.Group>
        </Form>
        <Button variant='info' onClick={() => navigate(-1)}>Back</Button>
    </Container>
}
