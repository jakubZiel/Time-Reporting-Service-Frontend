import {Form, Button, Container} from 'react-bootstrap'
import {useFetch} from 'use-http'
import APIRoot from '../API'
import {useParams, useNavigate} from 'react-router-dom'
import {useContext, useState} from 'react'
import Context from '../Identity/Context'

export const ActivityDelete = () => {
    const {id} = useParams()
    const {context, setContext} = useContext(Context)
    const [activity, setActivity] = useState(context.todayActivities.find(activity => activity.id == id))
    const {del, response, error} = useFetch(APIRoot + "/Activity")
    const navigate = useNavigate()

    const deleteActivity = async () => {
        setContext({...context, todayActivities : context.todayActivities.filter(act => act.id != id)})
        const payload = {id : parseInt(id)}
        await del(`?id=${id}`)
        navigate(-1)
    }

    return <Container>
        <Form>
            <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control placeholder={activity.name} disabled/>
                <Form.Text></Form.Text>
            </Form.Group>
            <Form.Group controlId='desc'>
                <Form.Label>Description</Form.Label>
                <Form.Control placeholder={activity.description} disabled/>
                <Form.Text></Form.Text>
            </Form.Group>
            <Form.Group controlId='duration'>
                <Form.Label>Duration</Form.Label>
                <Form.Control placeholder={activity.durationMinutes} disabled/>
                <Form.Text></Form.Text>
            </Form.Group>
            <Form.Group controlId='category'>
                <Form.Label>Category</Form.Label>
                <Form.Control placeholder={activity.tag} disabled/>
                <Form.Text></Form.Text>
            </Form.Group>
        </Form>
        <Button variant='danger' onClick={() => deleteActivity()}>Delete</Button>
    </Container>
}
