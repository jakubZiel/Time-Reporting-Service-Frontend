import {Form, Button, Container} from 'react-bootstrap'
import {useFetch} from 'use-http'
import APIRoot from '../API'
import {useParams, useNavigate} from 'react-router-dom'
import {useRef, useState, useContext} from 'react'
import Context from '../Identity/Context'


export const ProjectEdit = () => {

    const {id} = useParams()
    const context = useContext(Context)
    const [project, setProject] = useState(context.context.projects.find(proj => proj.id == id))
    const name = useRef(null)
    const description = useRef(null)
    const budget = useRef(null)
    const checkBox = useRef(null)
    const [active, setActive] = useState(project.active)
    const navigate = useNavigate()
    const {put} = useFetch(APIRoot + "/Project")


    const postEdit = async () => {
        const edited = project

        if (name.current.value != '')
            edited.name = name.current.value
        if  (description.current.value != '')
            edited.description = description.current.value
        if  (budget.current.value != '')
            edited.timeBudget = budget.current.value

        edited.active = checkBox.current.checked

        description.current.value = ''
        name.current.value = ''
        budget.current.value = ''
        
        
        await put("", edited)
        setProject(edited)
    }    

    return <Container>
        <Form>
            <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control placeholder={project.name} ref={name}/>
                <Form.Text></Form.Text>
            </Form.Group>
            <Form.Group controlId='desc'>
                <Form.Label>Description</Form.Label>
                <Form.Control  placeholder={project.description} ref={description}/>
                <Form.Text></Form.Text>
            </Form.Group>
            <Form.Group controlId='budget'>
                <Form.Label>Time Budget</Form.Label>
                <Form.Control placeholder={project.timeBudget} ref={budget} type="number"/>
                <Form.Text></Form.Text>
            </Form.Group>
            <Form.Group controlId='active'>
                <Form.Label>Active</Form.Label>
                <Form.Check type="checkbox" onClick={() => {setActive(!active)}} ref={checkBox} checked={active}></Form.Check>
            </Form.Group>
        </Form>
        <Button onClick={() => postEdit()} variant='success'>Edit</Button>
    </Container>
}
