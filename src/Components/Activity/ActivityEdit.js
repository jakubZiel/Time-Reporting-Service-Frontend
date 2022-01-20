import {Form, Button, Container, Dropdown, Card} from 'react-bootstrap'
import {useFetch} from 'use-http'
import APIRoot from '../API'
import {useParams, useNavigate} from 'react-router-dom'
import {useRef, useContext, useState} from 'react'
import Context from '../Identity/Context'
import DropdownMenu from 'react-bootstrap/esm/DropdownMenu'
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle'
import DropdownItem from 'react-bootstrap/esm/DropdownItem'

export const ActivityEdit = () => {

    const {id} = useParams()
    const name = useRef(null)    
    const description = useRef(null)    
    const duration = useRef(null)    
    const category = useRef(null)    
    const {context, setContext} = useContext(Context)
    const [activity, setActivity] = useState(context.todayActivities.find(activity => activity.id == id))
    const {put, response} = useFetch(APIRoot + "/Activity")
    const navigate = useNavigate()

    const postEdit = async () => {
        const edited = activity

        if (name.current.value != '')
            edited.name = name.current.value
        if  (description.current.value != '')
            edited.description = description.current.value
        if (category.current.value != '')
            edited.tag = category.current.value
        if (duration.current.value != '')
            edited.durationMinutes = duration.current.value
        duration.current.value = ''
        category.current.value = ''
        description.current.value = ''
        name.current.value = ''
                
        await put("", edited)

        setActivity(edited)
        navigate(-1)
    }
    const tags = context.projects.find(proj => proj.id == activity.projectID).tags.map(tag => tag.name)


    return <Container style={{display : "flex", alignItems : "center", justifyContent : "center", flexDirection:"column", textAlign:"center"}}>
        <Card style={{width: "35rem", margin: "1rem", padding: "1rem"}}>
            <Form>
                <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control placeholder={activity.name} ref={name}/>
                    <Form.Text></Form.Text>
                </Form.Group>
                <Form.Group controlId='desc'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" placeholder={activity.description} ref={description}/>
                    <Form.Text></Form.Text>
                </Form.Group>
                <Form.Group controlId='duration'>
                    <Form.Label>Duration</Form.Label>
                    <Form.Control type="number" placeholder={activity.durationMinutes} ref={duration}/>
                    <Form.Text></Form.Text>
                </Form.Group>
                <Form.Group controlId='category'>
                    <Form.Label>Category</Form.Label>
                    <Form.Control disabled placeholder={activity.tag} ref={category}/>
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
            <Button onClick={() => postEdit()} variant='success'>Edit</Button>
        </Card>
    </Container>
}
