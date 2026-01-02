import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client'
import { HttpLink } from '@apollo/client/link/http'

const compoundOperations = [
    'GetCompounds',
    'CreateCompound',
    'DeleteCompound',
    'BulkCreateCompounds',
]

const getBaseUrl = () => {
    const protocol = window.location.protocol
    const hostname = window.location.hostname
    const port = import.meta.env.BACKEND_API_PORT || '8000'
    return `${protocol}//${hostname}:${port}`
}

const baseUrl = getBaseUrl()

const projectsHttpLink = new HttpLink({
    uri: `${baseUrl}/projects/`,
})

const compoundsHttpLink = new HttpLink({
    uri: `${baseUrl}/compounds/`,
})

const routingLink = new ApolloLink((operation, forward) => {
    const { operationName } = operation

    const isCompoundOperation = compoundOperations.some(op =>
        operationName?.includes(op)
    )

    return (isCompoundOperation ? compoundsHttpLink : projectsHttpLink).request(
        operation,
        forward
    )
})

export const apolloClient = new ApolloClient({
    link: routingLink,
    cache: new InMemoryCache(),
})
