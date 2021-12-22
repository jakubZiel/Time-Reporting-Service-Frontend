import {Form, Button, Container} from 'react-bootstrap'
import {useFetch} from 'use-http'
import APIRoot from '../API'
import {useParams} from 'react-router-dom'
import {useRef, useState, useContext} from 'react'
import Context from '../Identity/Context'


export const ProjectEdit = () => {

    const {id} = useParams()
    const context = useContext(Context)
    const [project, setProject] = useState(context.context.projects.find(proj => proj.id == id))
    const name = useRef(null)    

    return <Container>
        <Form>
            <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control placeholder={project.name} ref={name}/>
                <Form.Text></Form.Text>
            </Form.Group>
            <Form.Group controlId='desc'>
                <Form.Label>Description</Form.Label>
                <Form.Control  placeholder={project.description}/>
                <Form.Text></Form.Text>
            </Form.Group>
            <Form.Group controlId='budget'>
                <Form.Label>Time Budget</Form.Label>
                <Form.Control placeholder={project.timeBudget} type="number"/>
                <Form.Text></Form.Text>
            </Form.Group>
        </Form>
        <Button variant='success'>Edit</Button>
    </Container>
}
